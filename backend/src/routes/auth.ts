import { FastifyInstance } from "fastify";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function authRoutes(fastify: FastifyInstance) {
  // Frontend (NextAuth) Google'dan olgan ID tokenni shu yerga yuboradi.
  // Agar bu email bilan User mavjud bo'lmasa — avtomatik yaratiladi (signup),
  // mavjud bo'lsa — shunchaki login qilinadi. Alohida signup endpoint yo'q.
  fastify.post("/auth/google", async (request, reply) => {
    const { idToken } = request.body as { idToken?: string };

    if (!idToken) {
      return reply.status(400).send({ error: "idToken talab qilinadi" });
    }

    // 1. Google tokenni tekshiramiz — bu soxta so'rovlarning oldini oladi
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      fastify.log.error(err);
      return reply.status(401).send({ error: "Google token yaroqsiz" });
    }

    if (!payload || !payload.email) {
      return reply.status(401).send({ error: "Google'dan email olinmadi" });
    }

    const { email, name, picture, sub: googleId } = payload;

    // 2. User bazada bormi tekshiramiz, bo'lmasa yaratamiz
    let user = await fastify.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await fastify.prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          avatarUrl: picture,
          googleId,
        },
      });
      fastify.log.info(`Yangi foydalanuvchi yaratildi: ${email}`);
    } else if (!user.googleId) {
      // Agar user avval boshqa yo'l bilan yaratilgan bo'lsa (nazariy holat),
      // googleId'ni bog'lab qo'yamiz
      user = await fastify.prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    }

    // 3. O'zimizning JWT'ni yaratamiz — shundan keyingi barcha so'rovlar shu bilan boradi
    const token = fastify.jwt.sign({
      userId: user.id,
      email: user.email,
    });

    return reply.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  });

  // Himoyalangan endpoint namunasi — token orqali "men kimman" so'rash
  fastify.get(
    "/auth/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { userId } = request.user as { userId: string };

      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, avatarUrl: true },
      });

      if (!user) {
        return reply.status(404).send({ error: "Foydalanuvchi topilmadi" });
      }

      return reply.send({ user });
    }
  );
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PARTS } from "../src/lib/nbeo-content";
import { buildQuestionBank } from "./question-bank";
import { VIDEOS, CHECKLISTS, RESOURCES, BLOG_POSTS } from "./media-content";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding OptiPrep…");

  // Clean slate (order matters for FKs).
  await prisma.response.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.srsCard.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.rubricScore.deleteMany();
  await prisma.videoProgress.deleteMany();
  await prisma.studyTask.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.checklistStep.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.video.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.part.deleteMany();

  // ---- Parts / Subjects / Topics -----------------------------------------
  const subjectMap = new Map<string, string>(); // `${part}:${subjectSlug}` -> id
  const topicMap = new Map<string, string>(); // `${part}:${subjectSlug}:${topicSlug}` -> id

  for (const p of PARTS) {
    const part = await prisma.part.create({
      data: {
        slug: p.slug,
        number: p.number,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        color: p.color,
        blockCount: p.blockCount,
        itemsPerBlock: p.itemsPerBlock,
        minutesPerBlock: p.minutesPerBlock,
      },
    });

    for (const s of p.subjects) {
      const subject = await prisma.subject.create({
        data: {
          partId: part.id,
          name: s.name,
          slug: s.slug,
          weight: s.weight,
          blueprint: s.blueprint,
          order: p.subjects.indexOf(s),
        },
      });
      subjectMap.set(`${p.slug}:${s.slug}`, subject.id);

      for (let i = 0; i < s.topics.length; i++) {
        const topic = await prisma.topic.create({
          data: {
            subjectId: subject.id,
            name: s.topics[i].name,
            slug: s.topics[i].slug,
            order: i,
          },
        });
        topicMap.set(`${p.slug}:${s.slug}:${s.topics[i].slug}`, topic.id);
      }
    }
  }
  console.log(`  ✓ ${PARTS.length} parts, ${subjectMap.size} subjects, ${topicMap.size} topics`);

  // ---- Questions ----------------------------------------------------------
  const bank = buildQuestionBank();
  let created = 0;
  let freeCount = 0;
  const partCounts: Record<string, number> = {};

  const chunkSize = 40;
  for (let i = 0; i < bank.length; i += chunkSize) {
    const chunk = bank.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map((qq, idx) => {
        const subjectId = subjectMap.get(`${qq.partSlug}:${qq.subjectSlug}`);
        if (!subjectId) return Promise.resolve();
        const topicId = qq.topicSlug
          ? topicMap.get(`${qq.partSlug}:${qq.subjectSlug}:${qq.topicSlug}`) ?? null
          : null;
        const globalIndex = i + idx;
        const isFree = qq.free === true || globalIndex % 26 === 0;
        if (isFree) freeCount++;
        partCounts[qq.partSlug] = (partCounts[qq.partSlug] ?? 0) + 1;
        created++;
        return prisma.question.create({
          data: {
            part: { connect: { slug: qq.partSlug } },
            subject: { connect: { id: subjectId } },
            ...(topicId ? { topic: { connect: { id: topicId } } } : {}),
            stem: qq.stem,
            explanation: qq.explanation,
            reference: qq.reference,
            difficulty: qq.difficulty,
            isFree,
            options: {
              create: qq.options.map((o, oi) => ({
                text: o.text,
                isCorrect: o.isCorrect,
                order: oi,
              })),
            },
          },
        });
      }),
    );
    if (i % 400 === 0) process.stdout.write(`\r  … ${created}/${bank.length} questions`);
  }
  process.stdout.write(`\r  ✓ ${created} questions created (${freeCount} free)          \n`);
  console.log(`    Per part: ${JSON.stringify(partCounts)}`);

  // Update part totals.
  for (const p of PARTS) {
    await prisma.part.update({
      where: { slug: p.slug },
      data: { totalItems: partCounts[p.slug] ?? 0 },
    });
  }

  // ---- Videos -------------------------------------------------------------
  for (const v of VIDEOS) {
    const subjectId = v.subjectSlug && v.partSlug ? subjectMap.get(`${v.partSlug}:${v.subjectSlug}`) : undefined;
    await prisma.video.create({
      data: {
        title: v.title,
        description: v.description,
        youtubeId: v.youtubeId,
        durationSec: v.durationSec,
        category: v.category,
        isFree: v.isFree ?? false,
        ...(v.partSlug ? { part: { connect: { slug: v.partSlug } } } : {}),
        ...(subjectId ? { subject: { connect: { id: subjectId } } } : {}),
      },
    });
  }
  console.log(`  ✓ ${VIDEOS.length} videos`);

  // ---- Checklists ---------------------------------------------------------
  for (const c of CHECKLISTS) {
    await prisma.checklist.create({
      data: {
        part: { connect: { slug: c.partSlug } },
        title: c.title,
        technique: c.technique,
        description: c.description,
        order: CHECKLISTS.indexOf(c),
        steps: {
          create: c.steps.map((s, i) => ({
            text: s.text,
            critical: s.critical ?? false,
            order: i,
          })),
        },
      },
    });
  }
  console.log(`  ✓ ${CHECKLISTS.length} clinical checklists`);

  // ---- Resources ----------------------------------------------------------
  for (const r of RESOURCES) {
    const subjectId = r.subjectSlug && r.partSlug ? subjectMap.get(`${r.partSlug}:${r.subjectSlug}`) : undefined;
    await prisma.resource.create({
      data: {
        kind: r.kind,
        title: r.title,
        slug: r.slug,
        summary: r.summary,
        body: r.body,
        tags: r.tags ?? [],
        ...(r.partSlug ? { part: { connect: { slug: r.partSlug } } } : {}),
        ...(subjectId ? { subject: { connect: { id: subjectId } } } : {}),
      },
    });
  }
  console.log(`  ✓ ${RESOURCES.length} resources`);

  // ---- Blog ---------------------------------------------------------------
  for (const b of BLOG_POSTS) {
    await prisma.blogPost.create({
      data: {
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        body: b.body,
        coverImage: b.coverImage,
        tags: b.tags ?? [],
      },
    });
  }
  console.log(`  ✓ ${BLOG_POSTS.length} blog posts`);

  // ---- Users --------------------------------------------------------------
  const adminHash = await bcrypt.hash("admin1234", 10);
  const studentHash = await bcrypt.hash("demo1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@optiprep.app" },
    update: { passwordHash: adminHash, role: "ADMIN" },
    create: {
      email: "admin@optiprep.app",
      name: "Admin",
      role: "ADMIN",
      passwordHash: adminHash,
      subscription: { create: { plan: "FULL_BUNDLE", status: "ACTIVE" } },
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "demo@optiprep.app" },
    update: { passwordHash: studentHash },
    create: {
      email: "demo@optiprep.app",
      name: "Demo Student",
      role: "STUDENT",
      passwordHash: studentHash,
      subscription: {
        create: {
          plan: "FULL_BUNDLE",
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
        },
      },
    },
  });
  console.log(`  ✓ users: ${admin.email} (admin), ${student.email} (student)`);

  // ---- Demo activity for the student (so analytics are populated) ---------
  await seedDemoActivity(student.id);

  const total = await prisma.question.count();
  console.log(`\n✅ Seed complete. Total questions in DB: ${total}`);
  if (total < 3000) {
    console.warn(`⚠️  Expected 3,000+ questions but found ${total}.`);
  }
}

async function seedDemoActivity(userId: string) {
  const parts = await prisma.part.findMany({ include: { subjects: true } });
  const now = Date.now();
  let attempts = 0;
  let srs = 0;

  for (let a = 0; a < 12; a++) {
    const part = parts[a % parts.length];
    const daysAgo = 30 - a * 2;
    const createdAt = new Date(now - daysAgo * 24 * 3600 * 1000);
    // Improving accuracy over time.
    const targetAccuracy = 0.5 + a * 0.03;

    const questions = await prisma.question.findMany({
      where: { partId: part.id },
      include: { options: true },
      take: 20,
      skip: (a * 17) % 200,
    });
    if (questions.length === 0) continue;

    const attempt = await prisma.attempt.create({
      data: {
        userId,
        partId: part.id,
        mode: a % 3 === 0 ? "TIMED" : a % 3 === 1 ? "TUTORED" : "RANDOM",
        status: "COMPLETED",
        title: `${part.subtitle} practice #${a + 1}`,
        createdAt,
        finishedAt: new Date(createdAt.getTime() + 25 * 60 * 1000),
        timeLimitSec: a % 3 === 0 ? 20 * 60 : null,
      },
    });
    attempts++;

    for (let qi = 0; qi < questions.length; qi++) {
      const q = questions[qi];
      const correctOpt = q.options.find((o) => o.isCorrect);
      const isCorrect = Math.random() < targetAccuracy;
      const selected = isCorrect
        ? correctOpt
        : q.options.find((o) => !o.isCorrect) ?? correctOpt;
      await prisma.response.create({
        data: {
          attemptId: attempt.id,
          questionId: q.id,
          selectedOptionId: selected?.id,
          isCorrect,
          flagged: qi % 9 === 0,
          timeSpentSec: 20 + Math.floor(Math.random() * 70),
          order: qi,
          answeredAt: new Date(createdAt.getTime() + qi * 40 * 1000),
        },
      });

      // Missed questions become spaced-repetition cards.
      if (!isCorrect) {
        try {
          await prisma.srsCard.create({
            data: {
              userId,
              questionId: q.id,
              easeFactor: 2.3,
              intervalDays: 1,
              repetitions: 0,
              dueDate: new Date(now + (Math.random() < 0.6 ? -1 : 1) * 24 * 3600 * 1000),
            },
          });
          srs++;
        } catch {
          // unique (userId, questionId) — already carded.
        }
      }
    }
  }

  // A few upcoming study tasks.
  const tasks = [
    { title: "Timed block: Optics", type: "simulator", offset: 0 },
    { title: "Review due SRS cards", type: "review", offset: 0 },
    { title: "Glaucoma high-yield sheet", type: "reading", offset: 1 },
    { title: "Daily adaptive quiz", type: "quiz", offset: 1 },
    { title: "Part 3: Tonometry checklist", type: "skills", offset: 2 },
  ];
  for (const t of tasks) {
    await prisma.studyTask.create({
      data: {
        userId,
        title: t.title,
        type: t.type,
        date: new Date(now + t.offset * 24 * 3600 * 1000),
      },
    });
  }

  console.log(`  ✓ demo activity: ${attempts} attempts, ${srs} SRS cards, ${tasks.length} study tasks`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

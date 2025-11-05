import { db } from '.';
import {
  BlockType,
  blogPosts,
  books,
  chapters,
  commentSections,
  comments,
  readerActivityLog,
  sections,
  user,
  userBookPurchases,
  userReadingProgress,
  type Block
} from './schema';

async function seed() {
  console.log('🌱 Starting database seed...');

  // Create users
  console.log('👥 Creating users...');
  const users = await db.insert(user).values([
    {
      id: 'user_1',
      username: 'john_doe',
      phone: '+1234567890',
      password: '$2a$10$hashedpassword1', // In production, use proper hashing
      age: 28
    },
    {
      id: 'user_2',
      username: 'jane_smith',
      phone: '+1234567891',
      password: '$2a$10$hashedpassword2',
      age: 32
    },
    {
      id: 'user_3',
      username: 'bob_wilson',
      phone: '+1234567892',
      password: '$2a$10$hashedpassword3',
      age: 25
    },
    {
      id: 'user_4',
      username: 'alice_brown',
      phone: '+1234567893',
      password: '$2a$10$hashedpassword4',
      age: 30
    },
    {
      id: 'admin_1',
      username: 'admin',
      phone: '+1234567894',
      password: '$2a$10$hashedpassword5',
      age: 35
    }
  ]).returning();

  // Create books
  console.log('📚 Creating books...');
  const booksData = await db.insert(books).values([
    {
      title: 'The Art of Programming',
      description: 'A comprehensive guide to modern programming practices, design patterns, and software architecture. Learn from real-world examples and best practices.',
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      publishedAt: new Date('2024-01-15'),
      price: 2999, // $29.99
      isFree: false,
      fakeViewers: 50000,
      fakePurchases: 2500,
      useFakeData: true
    },
    {
      title: 'Web Development Mastery',
      description: 'Master modern web development with HTML, CSS, JavaScript, and popular frameworks. Build responsive, accessible, and performant web applications.',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      publishedAt: new Date('2024-03-22'),
      price: 3499, // $34.99
      isFree: false,
      fakeViewers: 75000,
      fakePurchases: 3800,
      useFakeData: true
    },
    {
      title: 'Introduction to SvelteKit',
      description: 'Free comprehensive guide to getting started with SvelteKit framework. Learn routing, server-side rendering, and building full-stack applications.',
      coverImage: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=400',
      publishedAt: new Date('2024-02-10'),
      price: null,
      isFree: true,
      fakeViewers: 120000,
      fakePurchases: 0,
      useFakeData: false
    },
    {
      title: 'Database Design Patterns',
      description: 'Advanced patterns for scalable database architecture. Learn indexing strategies, query optimization, and database scaling techniques.',
      coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400',
      publishedAt: null, // Unpublished
      price: 4999, // $49.99
      isFree: false,
      fakeViewers: 35000,
      fakePurchases: 1200,
      useFakeData: true
    },
    {
      title: 'Machine Learning Fundamentals',
      description: 'Comprehensive introduction to machine learning algorithms, neural networks, and practical applications in modern software.',
      coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
      publishedAt: new Date('2024-04-01'),
      price: 5999, // $59.99
      isFree: false,
      fakeViewers: 60000,
      fakePurchases: 2100,
      useFakeData: true
    }
  ]).returning();

  // Create chapters for books
  console.log('📖 Creating chapters...');
  const chaptersData = await db.insert(chapters).values([
    // Chapters for "The Art of Programming"
    {
      bookId: booksData[0].id,
      title: 'Introduction to Clean Code',
      orderIndex: 0,
      nextChapterId: null, // Will update after creating next chapter
      tags: ['clean-code', 'basics', 'introduction']
    },
    {
      bookId: booksData[0].id,
      title: 'Design Patterns',
      orderIndex: 1,
      nextChapterId: null,
      tags: ['design-patterns', 'architecture']
    },
    {
      bookId: booksData[0].id,
      title: 'Testing Strategies',
      orderIndex: 2,
      nextChapterId: null,
      tags: ['testing', 'tdd', 'quality-assurance']
    },
    // Chapters for "Web Development Mastery"
    {
      bookId: booksData[1].id,
      title: 'HTML & CSS Fundamentals',
      orderIndex: 0,
      nextChapterId: null,
      tags: ['html', 'css', 'fundamentals']
    },
    {
      bookId: booksData[1].id,
      title: 'JavaScript Essentials',
      orderIndex: 1,
      nextChapterId: null,
      tags: ['javascript', 'programming']
    },
    {
      bookId: booksData[1].id,
      title: 'Modern Frameworks',
      orderIndex: 2,
      nextChapterId: null,
      tags: ['react', 'vue', 'svelte', 'frameworks']
    },
    // Chapters for "Introduction to SvelteKit"
    {
      bookId: booksData[2].id,
      title: 'Getting Started',
      orderIndex: 0,
      nextChapterId: null,
      tags: ['sveltekit', 'setup', 'introduction']
    },
    {
      bookId: booksData[2].id,
      title: 'Routing & Navigation',
      orderIndex: 1,
      nextChapterId: null,
      tags: ['routing', 'navigation', 'sveltekit']
    },
    // Chapters for "Database Design Patterns"
    {
      bookId: booksData[3].id,
      title: 'Database Fundamentals',
      orderIndex: 0,
      nextChapterId: null,
      tags: ['database', 'sql', 'fundamentals']
    },
    {
      bookId: booksData[3].id,
      title: 'Indexing Strategies',
      orderIndex: 1,
      nextChapterId: null,
      tags: ['indexing', 'performance', 'optimization']
    }
  ]).returning();

  // Create sections for chapters
  console.log('📄 Creating sections...');
  const blocks1: Block[] = [
    {
      type: BlockType.HEADING,
      name: 'main-heading',
      value: 'What is Clean Code?',
      order: 0
    },
    {
      type: BlockType.MARKDOWN,
      name: 'intro-text',
      value: 'Clean code is code that is easy to read, understand, and maintain. It follows consistent conventions and expresses intent clearly.',
      order: 1
    },
    {
      type: BlockType.SECTION_TITLE,
      name: 'principles',
      value: 'Core Principles',
      order: 2
    },
    {
      type: BlockType.MARKDOWN,
      name: 'principles-text',
      value: '1. **Meaningful Names**: Use descriptive variable and function names\n2. **Small Functions**: Keep functions focused on a single task\n3. **Comments When Needed**: Write self-documenting code, add comments for complex logic',
      order: 3
    }
  ];

  const sectionsData = await db.insert(sections).values([
    // Sections for first chapter of "The Art of Programming"
    {
      chapterId: chaptersData[0].id,
      title: 'What is Clean Code?',
      content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Introduction to clean code principles' }] }] },
      orderIndex: 0,
      nextSectionId: null,
      blocks: blocks1,
      tags: ['introduction', 'clean-code']
    },
    {
      chapterId: chaptersData[0].id,
      title: 'Naming Conventions',
      content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'How to name variables, functions, and classes effectively' }] }] },
      orderIndex: 1,
      nextSectionId: null,
      blocks: [
        {
          type: BlockType.HEADING,
          name: 'naming-heading',
          value: 'Naming Best Practices',
          order: 0
        },
        {
          type: BlockType.MARKDOWN,
          name: 'naming-content',
          value: 'Use intention-revealing names that make your code self-documenting.',
          order: 1
        }
      ],
      tags: ['naming', 'conventions']
    },
    // Sections for second chapter
    {
      chapterId: chaptersData[1].id,
      title: 'Singleton Pattern',
      content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Understanding the singleton design pattern' }] }] },
      orderIndex: 0,
      nextSectionId: null,
      blocks: [
        {
          type: BlockType.HEADING,
          name: 'singleton-heading',
          value: 'Singleton Pattern',
          order: 0
        },
        {
          type: BlockType.MARKDOWN,
          name: 'singleton-content',
          value: 'The Singleton pattern ensures a class has only one instance and provides a global point of access to it.',
          order: 1
        }
      ],
      tags: ['singleton', 'design-patterns']
    },
    // Section for SvelteKit book
    {
      chapterId: chaptersData[6].id,
      title: 'Project Setup',
      content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Setting up your first SvelteKit project' }] }] },
      orderIndex: 0,
      nextSectionId: null,
      blocks: [
        {
          type: BlockType.HEADING,
          name: 'setup-heading',
          value: 'Creating a New Project',
          order: 0
        },
        {
          type: BlockType.MARKDOWN,
          name: 'setup-content',
          value: 'Run `npm create svelte@latest my-app` to create a new SvelteKit project.',
          order: 1
        }
      ],
      tags: ['setup', 'installation']
    }
  ]).returning();

  // Create book purchases
  console.log('💳 Creating book purchases...');
  await db.insert(userBookPurchases).values([
    {
      userId: users[0].id,
      bookId: booksData[0].id,
      purchasedAt: new Date('2024-01-20'),
      price: 2999
    },
    {
      userId: users[0].id,
      bookId: booksData[1].id,
      purchasedAt: new Date('2024-03-25'),
      price: 3499
    },
    {
      userId: users[1].id,
      bookId: booksData[0].id,
      purchasedAt: new Date('2024-02-15'),
      price: 2999
    },
    {
      userId: users[1].id,
      bookId: booksData[4].id,
      purchasedAt: new Date('2024-04-05'),
      price: 5999
    },
    {
      userId: users[2].id,
      bookId: booksData[1].id,
      purchasedAt: new Date('2024-03-28'),
      price: 3499
    }
  ]);

  // Create reading progress
  console.log('📊 Creating reading progress...');
  await db.insert(userReadingProgress).values([
    {
      userId: users[0].id,
      bookId: booksData[0].id,
      chapterId: chaptersData[0].id,
      sectionId: sectionsData[0].id,
      progressPercentage: 45,
      lastReadAt: new Date('2024-10-15'),
      completedAt: null,
      bookmarked: true
    },
    {
      userId: users[0].id,
      bookId: booksData[1].id,
      chapterId: chaptersData[3].id,
      sectionId: null,
      progressPercentage: 20,
      lastReadAt: new Date('2024-10-10'),
      completedAt: null,
      bookmarked: false
    },
    {
      userId: users[1].id,
      bookId: booksData[0].id,
      chapterId: chaptersData[2].id,
      sectionId: null,
      progressPercentage: 100,
      lastReadAt: new Date('2024-09-30'),
      completedAt: new Date('2024-09-30'),
      bookmarked: false
    },
    {
      userId: users[2].id,
      bookId: booksData[2].id,
      chapterId: chaptersData[6].id,
      sectionId: sectionsData[3].id,
      progressPercentage: 65,
      lastReadAt: new Date('2024-11-01'),
      completedAt: null,
      bookmarked: true
    }
  ]);

  // Create blog posts
  console.log('📝 Creating blog posts...');
  const blogPostsData = await db.insert(blogPosts).values([
    {
      authorId: users[4].id, // admin
      title: '10 Tips for Writing Clean Code',
      category: 'Programming',
      readTime: 8,
      slug: '10-tips-for-writing-clean-code',
      content: { 
        type: 'doc', 
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '10 Tips for Writing Clean Code' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Clean code is essential for maintainability...' }] }
        ] 
      },
      excerpt: 'Learn the most important principles for writing maintainable code',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      published: true,
      publishedAt: new Date('2024-10-01'),
      createdAt: new Date('2024-09-25'),
      updatedAt: new Date('2024-10-01'),
      tags: ['programming', 'clean-code', 'best-practices']
    },
    {
      authorId: users[4].id,
      title: 'Getting Started with SvelteKit',
      category: 'Web Development',
      readTime: 12,
      slug: 'getting-started-with-sveltekit',
      content: { 
        type: 'doc', 
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Getting Started with SvelteKit' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'SvelteKit is a framework for building web applications...' }] }
        ] 
      },
      excerpt: 'A comprehensive guide to building your first SvelteKit application',
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      published: true,
      publishedAt: new Date('2024-10-15'),
      createdAt: new Date('2024-10-10'),
      updatedAt: new Date('2024-10-15'),
      tags: ['sveltekit', 'web-development', 'tutorial']
    },
    {
      authorId: users[4].id,
      title: 'Database Optimization Techniques',
      category: 'Database',
      readTime: 15,
      slug: 'database-optimization-techniques',
      content: { 
        type: 'doc', 
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Database Optimization' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Learn how to optimize your database queries...' }] }
        ] 
      },
      excerpt: 'Advanced techniques for improving database performance',
      coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
      published: false,
      publishedAt: null,
      createdAt: new Date('2024-11-01'),
      updatedAt: new Date('2024-11-02'),
      tags: ['database', 'optimization', 'performance']
    }
  ]).returning();

  // Create comment sections
  console.log('💬 Creating comment sections...');
  const commentSectionsData = await db.insert(commentSections).values([
    {
      blogPostId: blogPostsData[0].id,
      bookId: null,
      chapterId: null,
      enabled: true,
      createdAt: new Date('2024-10-01')
    },
    {
      blogPostId: blogPostsData[1].id,
      bookId: null,
      chapterId: null,
      enabled: true,
      createdAt: new Date('2024-10-15')
    },
    {
      blogPostId: null,
      bookId: booksData[0].id,
      chapterId: null,
      enabled: true,
      createdAt: new Date('2024-01-15')
    },
    {
      blogPostId: null,
      bookId: null,
      chapterId: chaptersData[0].id,
      enabled: true,
      createdAt: new Date('2024-01-15')
    }
  ]).returning();

  // Create comments
  console.log('💭 Creating comments...');
  const commentsData = await db.insert(comments).values([
    {
      commentSectionId: commentSectionsData[0].id,
      userId: users[0].id,
      parentCommentId: null,
      content: 'Great article! Very helpful tips.',
      createdAt: new Date('2024-10-02'),
      updatedAt: null,
      deleted: false
    },
    {
      commentSectionId: commentSectionsData[0].id,
      userId: users[1].id,
      parentCommentId: null,
      content: 'I especially liked tip #5 about meaningful names.',
      createdAt: new Date('2024-10-03'),
      updatedAt: null,
      deleted: false
    },
    {
      commentSectionId: commentSectionsData[1].id,
      userId: users[2].id,
      parentCommentId: null,
      content: 'This tutorial helped me get started with SvelteKit. Thanks!',
      createdAt: new Date('2024-10-16'),
      updatedAt: null,
      deleted: false
    },
    {
      commentSectionId: commentSectionsData[2].id,
      userId: users[0].id,
      parentCommentId: null,
      content: 'Excellent book! Looking forward to more chapters.',
      createdAt: new Date('2024-01-22'),
      updatedAt: null,
      deleted: false
    }
  ]).returning();

  // Create nested replies
  await db.insert(comments).values([
    {
      commentSectionId: commentSectionsData[0].id,
      userId: users[4].id, // admin replying
      parentCommentId: commentsData[0].id,
      content: 'Thank you! Glad you found it helpful.',
      createdAt: new Date('2024-10-02T12:00:00'),
      updatedAt: null,
      deleted: false
    },
    {
      commentSectionId: commentSectionsData[0].id,
      userId: users[4].id,
      parentCommentId: commentsData[1].id,
      content: 'Yes! Meaningful names make code so much easier to understand.',
      createdAt: new Date('2024-10-03T14:30:00'),
      updatedAt: null,
      deleted: false
    }
  ]);

  // Create reader activity logs
  console.log('📈 Creating reader activity logs...');
  await db.insert(readerActivityLog).values([
    {
      userId: users[0].id,
      sectionId: sectionsData[0].id,
      blogPostId: null,
      sessionId: 'session_1',
      startedAt: new Date('2024-10-15T10:00:00'),
      endedAt: new Date('2024-10-15T10:25:00'),
      timeSpentSeconds: 1500,
      scrollDepthPercentage: 100,
      wordsRead: 450,
      completedReading: true,
      interactionCount: 5,
      deviceType: 'desktop',
      referrerSource: 'google',
      exitedEarly: false,
      returnVisit: false,
      createdAt: new Date('2024-10-15T10:25:00')
    },
    {
      userId: users[0].id,
      sectionId: null,
      blogPostId: blogPostsData[0].id,
      sessionId: 'session_2',
      startedAt: new Date('2024-10-02T14:00:00'),
      endedAt: new Date('2024-10-02T14:08:00'),
      timeSpentSeconds: 480,
      scrollDepthPercentage: 100,
      wordsRead: 800,
      completedReading: true,
      interactionCount: 3,
      deviceType: 'mobile',
      referrerSource: 'twitter',
      exitedEarly: false,
      returnVisit: false,
      createdAt: new Date('2024-10-02T14:08:00')
    },
    {
      userId: users[1].id,
      sectionId: sectionsData[0].id,
      blogPostId: null,
      sessionId: 'session_3',
      startedAt: new Date('2024-09-28T16:00:00'),
      endedAt: new Date('2024-09-28T16:10:00'),
      timeSpentSeconds: 600,
      scrollDepthPercentage: 45,
      wordsRead: 200,
      completedReading: false,
      interactionCount: 2,
      deviceType: 'tablet',
      referrerSource: 'direct',
      exitedEarly: true,
      returnVisit: false,
      createdAt: new Date('2024-09-28T16:10:00')
    },
    {
      userId: users[2].id,
      sectionId: null,
      blogPostId: blogPostsData[1].id,
      sessionId: 'session_4',
      startedAt: new Date('2024-10-16T09:00:00'),
      endedAt: new Date('2024-10-16T09:12:00'),
      timeSpentSeconds: 720,
      scrollDepthPercentage: 100,
      wordsRead: 1200,
      completedReading: true,
      interactionCount: 8,
      deviceType: 'desktop',
      referrerSource: 'reddit',
      exitedEarly: false,
      returnVisit: false,
      createdAt: new Date('2024-10-16T09:12:00')
    }
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`
📊 Summary:
- ${users.length} users created
- ${booksData.length} books created
- ${chaptersData.length} chapters created
- ${sectionsData.length} sections created
- Blog posts, comments, and activity logs created
  `);
}

// Run the seed function
seed()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('🏁 Seed script finished');
    process.exit(0);
  });
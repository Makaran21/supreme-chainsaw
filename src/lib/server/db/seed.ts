// db/seed.ts
import { db } from './index';
import { 
  books, 
  chapters, 
  sections, 
  user, 
  userBookPurchases, 
  userReadingProgress,
  blogPosts,
  commentSections,
  comments,
  readerActivityLog
} from './schema';
import type { Content } from '@tiptap/core';

const defaultTiptapContent: Content = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Section Content' }]
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a sample paragraph with some '
        },
        {
          type: 'text',
          marks: [{ type: 'bold' }],
          text: 'bold text'
        },
        {
          type: 'text',
          text: ' and some '
        },
        {
          type: 'text',
          marks: [{ type: 'italic' }],
          text: 'italic text'
        },
        {
          type: 'text',
          text: '.'
        }
      ]
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Here is another paragraph with a '
        },
        {
          type: 'text',
          marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
          text: 'link'
        },
        {
          type: 'text',
          text: '.'
        }
      ]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'First item' }]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Second item' }]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Third item' }]
            }
          ]
        }
      ]
    }
  ]
};

const blogPostContent: Content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Welcome to this comprehensive guide on modern web development. In this article, we\'ll explore the latest trends and best practices.'
        }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Key Takeaways' }]
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Throughout this post, you\'ll learn about cutting-edge techniques that will elevate your development skills.'
        }
      ]
    }
  ]
};

async function seed() {
  console.log('🌱 Starting seed...');

  // Create users
  console.log('👤 Creating users...');
  const userData = [
    { id: 'user_1', username: 'alice', age: 25 },
    { id: 'user_2', username: 'bob', age: 30 },
    { id: 'user_3', username: 'charlie', age: 28 },
    { id: 'user_4', username: 'diana', age: 32 },
    { id: 'user_5', username: 'eve', age: 27 }
  ];

  const createdUsers = [];
  for (const u of userData) {
    const [insertedUser] = await db.insert(user).values(u).returning();
    createdUsers.push(insertedUser);
    console.log(`  ✅ Created user: ${insertedUser.username}`);
  }

  // Create books
  console.log('\n📚 Creating books...');
  const bookData = [
    {
      title: 'Introduction to Web Development',
      description: 'A comprehensive guide to modern web development practices and technologies.',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      price: 2999, // $29.99
      isFree: false
    },
    {
      title: 'Advanced JavaScript Patterns',
      description: 'Master advanced JavaScript concepts, design patterns, and best practices.',
      coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
      price: null,
      isFree: true
    }
  ];

  const createdBooks: any[] = [];
  const allChapters: any[] = [];
  const allSections: any[] = [];

  for (const book of bookData) {
    console.log(`📚 Creating book: ${book.title}`);

    const [insertedBook] = await db.insert(books).values(book).returning();
    createdBooks.push(insertedBook);

    // Create 20 chapters per book
    for (let chapterIndex = 0; chapterIndex < 20; chapterIndex++) {
      const chapterTitle = `Chapter ${chapterIndex + 1}: ${getChapterTitle(chapterIndex)}`;

      const [insertedChapter] = await db.insert(chapters).values({
        bookId: insertedBook.id,
        title: chapterTitle,
        orderIndex: chapterIndex,
        nextChapterId: null,
        tags: getChapterTags(chapterIndex)
      }).returning();

      allChapters.push(insertedChapter);

      // Create 5 sections per chapter
      for (let sectionIndex = 0; sectionIndex < 5; sectionIndex++) {
        const [insertedSection] = await db.insert(sections).values({
          chapterId: insertedChapter.id,
          title: `Section ${sectionIndex + 1}: ${getSectionTitle(sectionIndex)}`,
          content: defaultTiptapContent,
          orderIndex: sectionIndex,
          nextSectionId: null,
          blocks: [],
          tags: getSectionTags(sectionIndex)
        }).returning();

        allSections.push(insertedSection);
      }
    }

    console.log(`✅ Completed book: ${book.title} (20 chapters, 100 sections)`);
  }

  // Create purchases and reading progress
  console.log('\n💰 Creating purchases and reading progress...');

  // Alice purchased the first book
  await db.insert(userBookPurchases).values({
    userId: createdUsers[0].id,
    bookId: createdBooks[0].id,
    purchasedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    price: 2999
  });
  console.log('  ✅ Alice purchased "Introduction to Web Development"');

  // Alice is 30% through the first book
  const aliceChapter = allChapters.find(c => c.bookId === createdBooks[0].id && c.orderIndex === 5);
  const aliceSection = allSections.find(s => s.chapterId === aliceChapter?.id && s.orderIndex === 1);
  
  await db.insert(userReadingProgress).values({
    userId: createdUsers[0].id,
    bookId: createdBooks[0].id,
    chapterId: aliceChapter?.id,
    sectionId: aliceSection?.id,
    progressPercentage: 30,
    lastReadAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: null,
    bookmarked: true
  });
  console.log('  ✅ Alice is 30% through first book');

  // Bob has access to the free book
  await db.insert(userReadingProgress).values({
    userId: createdUsers[1].id,
    bookId: createdBooks[1].id,
    chapterId: null,
    sectionId: null,
    progressPercentage: 0,
    lastReadAt: new Date(),
    completedAt: null,
    bookmarked: false
  });
  console.log('  ✅ Bob started the free book');

  // Charlie purchased and completed the first book
  await db.insert(userBookPurchases).values({
    userId: createdUsers[2].id,
    bookId: createdBooks[0].id,
    purchasedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    price: 2999
  });

  const lastChapter = allChapters.find(c => c.bookId === createdBooks[0].id && c.orderIndex === 19);
  const lastSection = allSections.find(s => s.chapterId === lastChapter?.id && s.orderIndex === 4);

  await db.insert(userReadingProgress).values({
    userId: createdUsers[2].id,
    bookId: createdBooks[0].id,
    chapterId: lastChapter?.id,
    sectionId: lastSection?.id,
    progressPercentage: 100,
    lastReadAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    bookmarked: false
  });
  console.log('  ✅ Charlie completed the first book');

  // Diana purchased the first book
  await db.insert(userBookPurchases).values({
    userId: createdUsers[3].id,
    bookId: createdBooks[0].id,
    purchasedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    price: 2999
  });
  console.log('  ✅ Diana purchased "Introduction to Web Development"');

  // Create blog posts
  console.log('\n📝 Creating blog posts...');
  const blogPostData = [
    {
      authorId: createdUsers[0].id,
      title: '10 Tips for Better Code Quality',
      slug: '10-tips-for-better-code-quality',
      content: blogPostContent,
      excerpt: 'Learn how to write cleaner, more maintainable code with these essential tips.',
      coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      published: true,
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      tags: ['coding', 'best-practices', 'quality']
    },
    {
      authorId: createdUsers[0].id,
      title: 'Understanding Async/Await in JavaScript',
      slug: 'understanding-async-await-javascript',
      content: blogPostContent,
      excerpt: 'A deep dive into asynchronous JavaScript programming with async/await.',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      published: true,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      tags: ['javascript', 'async', 'tutorial']
    },
    {
      authorId: createdUsers[2].id,
      title: 'Building Scalable Web Applications',
      slug: 'building-scalable-web-applications',
      content: blogPostContent,
      excerpt: 'Best practices and patterns for building applications that scale.',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      published: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ['architecture', 'scalability', 'performance']
    },
    {
      authorId: createdUsers[3].id,
      title: 'Draft: Future of Web Development',
      slug: 'future-of-web-development',
      content: blogPostContent,
      excerpt: 'Exploring upcoming trends and technologies in web development.',
      coverImage: null,
      published: false,
      publishedAt: null,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['trends', 'future', 'technology']
    }
  ];

  const createdBlogPosts: any[] = [];
  for (const post of blogPostData) {
    const [insertedPost] = await db.insert(blogPosts).values(post).returning();
    createdBlogPosts.push(insertedPost);
    console.log(`  ✅ Created blog post: ${insertedPost.title}`);
  }

  // Create comment sections
  console.log('\n💬 Creating comment sections...');
  const commentSectionData = [
    {
      blogPostId: createdBlogPosts[0].id,
      bookId: null,
      chapterId: null,
      enabled: true,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      blogPostId: createdBlogPosts[1].id,
      bookId: null,
      chapterId: null,
      enabled: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      blogPostId: createdBlogPosts[2].id,
      bookId: null,
      chapterId: null,
      enabled: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      blogPostId: null,
      bookId: createdBooks[0].id,
      chapterId: null,
      enabled: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      blogPostId: null,
      bookId: null,
      chapterId: allChapters[0].id,
      enabled: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  const createdCommentSections: any[] = [];
  for (const cs of commentSectionData) {
    const [insertedCS] = await db.insert(commentSections).values(cs).returning();
    createdCommentSections.push(insertedCS);
  }
  console.log(`  ✅ Created ${createdCommentSections.length} comment sections`);

  // Create comments
  console.log('\n💭 Creating comments...');
  const commentData = [
    // Comments on first blog post
    {
      commentSectionId: createdCommentSections[0].id,
      userId: createdUsers[1].id,
      parentCommentId: null,
      content: 'Great article! These tips are really helpful.',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      deleted: false
    },
    {
      commentSectionId: createdCommentSections[0].id,
      userId: createdUsers[2].id,
      parentCommentId: null,
      content: 'I especially loved tip #7. Game changer!',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      deleted: false
    },
    // Comments on second blog post
    {
      commentSectionId: createdCommentSections[1].id,
      userId: createdUsers[3].id,
      parentCommentId: null,
      content: 'This cleared up a lot of confusion I had about async/await. Thanks!',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      deleted: false
    },
    {
      commentSectionId: createdCommentSections[1].id,
      userId: createdUsers[4].id,
      parentCommentId: null,
      content: 'Could you do a follow-up on error handling with async/await?',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      deleted: false
    },
    // Comments on third blog post
    {
      commentSectionId: createdCommentSections[2].id,
      userId: createdUsers[0].id,
      parentCommentId: null,
      content: 'Excellent insights on scalability patterns!',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      deleted: false
    },
    // Comments on book
    {
      commentSectionId: createdCommentSections[3].id,
      userId: createdUsers[1].id,
      parentCommentId: null,
      content: 'Really enjoying this book so far. Very practical examples!',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      deleted: false
    },
    // Comments on chapter
    {
      commentSectionId: createdCommentSections[4].id,
      userId: createdUsers[2].id,
      parentCommentId: null,
      content: 'This chapter was particularly enlightening.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      deleted: false
    }
  ];

  const createdComments: any[] = [];
  for (const comment of commentData) {
    const [insertedComment] = await db.insert(comments).values(comment).returning();
    createdComments.push(insertedComment);
  }
  console.log(`  ✅ Created ${createdComments.length} comments`);

  // Create nested reply to first comment
  await db.insert(comments).values({
    commentSectionId: createdCommentSections[0].id,
    userId: createdUsers[0].id,
    parentCommentId: createdComments[0].id,
    content: 'Thanks! Glad you found it useful.',
    createdAt: new Date(Date.now() - 8.5 * 24 * 60 * 60 * 1000),
    updatedAt: null,
    deleted: false
  });
  console.log('  ✅ Created nested reply');

  // Create reader activity logs
  console.log('\n📊 Creating reader activity logs...');
  
  // Alice's reading activities on sections
  const aliceActivities = [
    {
      userId: createdUsers[0].id,
      sectionId: allSections[0].id,
      blogPostId: null,
      sessionId: 'session_alice_1',
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
      timeSpentSeconds: 900, // 15 minutes
      scrollDepthPercentage: 100,
      wordsRead: 450,
      completedReading: true,
      interactionCount: 5,
      deviceType: 'desktop',
      referrerSource: 'direct',
      exitedEarly: false,
      returnVisit: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      userId: createdUsers[0].id,
      sectionId: allSections[1].id,
      blogPostId: null,
      sessionId: 'session_alice_1',
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 1000),
      endedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 28 * 60 * 1000),
      timeSpentSeconds: 720, // 12 minutes
      scrollDepthPercentage: 85,
      wordsRead: 380,
      completedReading: false,
      interactionCount: 3,
      deviceType: 'desktop',
      referrerSource: 'direct',
      exitedEarly: true,
      returnVisit: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      userId: createdUsers[0].id,
      sectionId: allSections[1].id,
      blogPostId: null,
      sessionId: 'session_alice_2',
      startedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000),
      timeSpentSeconds: 480, // 8 minutes
      scrollDepthPercentage: 100,
      wordsRead: 450,
      completedReading: true,
      interactionCount: 2,
      deviceType: 'mobile',
      referrerSource: 'bookmark',
      exitedEarly: false,
      returnVisit: true,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    }
  ];

  // Bob's activities on blog posts
  const bobActivities = [
    {
      userId: createdUsers[1].id,
      sectionId: null,
      blogPostId: createdBlogPosts[0].id,
      sessionId: 'session_bob_1',
      startedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 6 * 60 * 1000),
      timeSpentSeconds: 360, // 6 minutes
      scrollDepthPercentage: 100,
      wordsRead: 800,
      completedReading: true,
      interactionCount: 8,
      deviceType: 'desktop',
      referrerSource: 'google',
      exitedEarly: false,
      returnVisit: false,
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
    },
    {
      userId: createdUsers[1].id,
      sectionId: null,
      blogPostId: createdBlogPosts[1].id,
      sessionId: 'session_bob_2',
      startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
      timeSpentSeconds: 600, // 10 minutes
      scrollDepthPercentage: 95,
      wordsRead: 950,
      completedReading: true,
      interactionCount: 12,
      deviceType: 'tablet',
      referrerSource: 'twitter',
      exitedEarly: false,
      returnVisit: false,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    }
  ];

  // Charlie's mixed activities
  const charlieActivities = [
    {
      userId: createdUsers[2].id,
      sectionId: allSections[10].id,
      blogPostId: null,
      sessionId: 'session_charlie_1',
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000),
      timeSpentSeconds: 1200, // 20 minutes
      scrollDepthPercentage: 100,
      wordsRead: 500,
      completedReading: true,
      interactionCount: 15,
      deviceType: 'desktop',
      referrerSource: 'direct',
      exitedEarly: false,
      returnVisit: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      userId: createdUsers[2].id,
      sectionId: null,
      blogPostId: createdBlogPosts[2].id,
      sessionId: 'session_charlie_2',
      startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 7 * 60 * 1000),
      timeSpentSeconds: 420, // 7 minutes
      scrollDepthPercentage: 100,
      wordsRead: 850,
      completedReading: true,
      interactionCount: 6,
      deviceType: 'mobile',
      referrerSource: 'linkedin',
      exitedEarly: false,
      returnVisit: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  // Diana's activities
  const dianaActivities = [
    {
      userId: createdUsers[3].id,
      sectionId: allSections[5].id,
      blogPostId: null,
      sessionId: 'session_diana_1',
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
      timeSpentSeconds: 300, // 5 minutes
      scrollDepthPercentage: 60,
      wordsRead: 250,
      completedReading: false,
      interactionCount: 2,
      deviceType: 'mobile',
      referrerSource: 'direct',
      exitedEarly: true,
      returnVisit: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ];

  const allActivities = [
    ...aliceActivities,
    ...bobActivities,
    ...charlieActivities,
    ...dianaActivities
  ];

  for (const activity of allActivities) {
    await db.insert(readerActivityLog).values(activity);
  }
  console.log(`  ✅ Created ${allActivities.length} reader activity logs`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('📊 Summary:');
  console.log(`  📚 Books: ${createdBooks.length}`);
  console.log(`  📖 Chapters: ${allChapters.length}`);
  console.log(`  📄 Sections: ${allSections.length}`);
  console.log(`  👥 Users: ${createdUsers.length}`);
  console.log(`  💰 Purchases: 3`);
  console.log(`  📈 Reading progress entries: 4`);
  console.log(`  📝 Blog posts: ${createdBlogPosts.length}`);
  console.log(`  💬 Comment sections: ${createdCommentSections.length}`);
  console.log(`  💭 Comments: ${createdComments.length + 1} (including 1 reply)`);
  console.log(`  📊 Activity logs: ${allActivities.length}`);
}

// Helper functions
function getChapterTitle(index: number): string {
  const titles = [
    'Getting Started',
    'Core Concepts',
    'Advanced Techniques',
    'Best Practices',
    'Performance Optimization',
    'Security Fundamentals',
    'Testing Strategies',
    'Deployment Guide',
    'Debugging Tips',
    'Common Patterns',
    'Error Handling',
    'State Management',
    'API Integration',
    'Authentication',
    'Database Design',
    'Scaling Applications',
    'Monitoring & Logging',
    'Code Organization',
    'Refactoring',
    'Future Trends'
  ];
  return titles[index] || `Topic ${index + 1}`;
}

function getSectionTitle(index: number): string {
  const titles = [
    'Introduction',
    'Key Concepts',
    'Practical Examples',
    'Common Pitfalls',
    'Summary'
  ];
  return titles[index] || `Part ${index + 1}`;
}

function getChapterTags(index: number): string[] {
  const tagGroups = [
    ['beginner', 'introduction'],
    ['fundamentals', 'core'],
    ['advanced', 'techniques'],
    ['best-practices', 'quality'],
    ['performance', 'optimization'],
    ['security', 'safety'],
    ['testing', 'qa'],
    ['deployment', 'devops'],
    ['debugging', 'troubleshooting'],
    ['patterns', 'architecture'],
    ['error-handling', 'reliability'],
    ['state', 'management'],
    ['api', 'integration'],
    ['auth', 'security'],
    ['database', 'storage'],
    ['scaling', 'performance'],
    ['monitoring', 'observability'],
    ['organization', 'structure'],
    ['refactoring', 'maintenance'],
    ['future', 'trends']
  ];
  return tagGroups[index] || ['general'];
}

function getSectionTags(index: number): string[] {
  const tagGroups = [
    ['intro', 'overview'],
    ['concepts', 'theory'],
    ['examples', 'practical'],
    ['pitfalls', 'warnings'],
    ['summary', 'recap']
  ];
  return tagGroups[index] || ['section'];
}

// Run the seed
seed()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
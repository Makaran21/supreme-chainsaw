// db/seed.ts
import { db } from './index';
import { books, chapters, sections } from './schema';
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

async function seed() {
  console.log('🌱 Starting seed...');

  // Create 2 books
  const bookData = [
    {
      title: 'Introduction to Web Development',
      description: 'A comprehensive guide to modern web development practices and technologies.',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
    },
    {
      title: 'Advanced JavaScript Patterns',
      description: 'Master advanced JavaScript concepts, design patterns, and best practices.',
      coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a'
    }
  ];

  for (const book of bookData) {
    console.log(`📚 Creating book: ${book.title}`);

    const [insertedBook] = await db.insert(books).values(book).returning();

    // Create 20 chapters per book
    for (let chapterIndex = 0; chapterIndex < 20; chapterIndex++) {
      const chapterTitle = `Chapter ${chapterIndex + 1}: ${getChapterTitle(chapterIndex)}`;

      console.log(`  📖 Creating ${chapterTitle}`);

      const [insertedChapter] = await db.insert(chapters).values({
        bookId: insertedBook.id,
        title: chapterTitle,
        orderIndex: chapterIndex,
        nextChapterId: null
      }).returning();

      // Create 5 sections per chapter
      for (let sectionIndex = 0; sectionIndex < 5; sectionIndex++) {
        await db.insert(sections).values({
          chapterId: insertedChapter.id,
          title: `Section ${sectionIndex + 1}: ${getSectionTitle(sectionIndex)}`,
          content: defaultTiptapContent,
          orderIndex: sectionIndex,
          nextSectionId: null,
          blocks: []
        });
      }

      console.log(`    ✅ Created 5 sections`);
    }

    console.log(`✅ Completed book: ${book.title} (20 chapters, 100 sections)\n`);
  }

  console.log('🎉 Seed completed successfully!');
  console.log('📊 Total: 2 books, 40 chapters, 200 sections');
}

// Helper functions to generate varied titles
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
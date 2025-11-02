CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`cover_image` text,
	`published` integer DEFAULT false NOT NULL,
	`published_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`tags` text,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `comment_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`blog_post_id` integer,
	`book_id` integer,
	`chapter_id` integer,
	`enabled` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comment_section_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`parent_comment_id` integer,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`deleted` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`comment_section_id`) REFERENCES `comment_sections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reader_activity_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`section_id` integer,
	`blog_post_id` integer,
	`session_id` text NOT NULL,
	`started_at` integer NOT NULL,
	`ended_at` integer,
	`time_spent_seconds` integer DEFAULT 0 NOT NULL,
	`scroll_depth_percentage` integer,
	`words_read` integer,
	`completed_reading` integer DEFAULT false NOT NULL,
	`interaction_count` integer DEFAULT 0 NOT NULL,
	`device_type` text,
	`referrer_source` text,
	`exited_early` integer DEFAULT false NOT NULL,
	`return_visit` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts`(`id`) ON UPDATE no action ON DELETE no action
);

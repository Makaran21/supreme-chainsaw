CREATE TABLE `user_book_purchases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`book_id` integer NOT NULL,
	`purchased_at` integer NOT NULL,
	`price` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_reading_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`book_id` integer NOT NULL,
	`chapter_id` integer,
	`section_id` integer,
	`progress_percentage` integer DEFAULT 0 NOT NULL,
	`last_read_at` integer NOT NULL,
	`completed_at` integer,
	`bookmarked` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `books` ADD `price` integer;--> statement-breakpoint
ALTER TABLE `books` ADD `is_free` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `username` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);
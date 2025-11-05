ALTER TABLE `blog_posts` ADD `fake_viewers` integer;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `fake_purchases` integer;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `use_fake_data` integer DEFAULT true NOT NULL;
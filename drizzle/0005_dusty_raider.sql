ALTER TABLE `books` ADD `published_at` integer;--> statement-breakpoint
ALTER TABLE `user` ADD `phone` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_phone_unique` ON `user` (`phone`);
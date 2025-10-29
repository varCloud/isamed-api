-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `contact` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,
    `nss` VARCHAR(191) NULL,
    `observations` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `contact` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `map_url` VARCHAR(191) NULL,
    `rfc` VARCHAR(191) NULL,
    `postal_code` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `optional_contact` VARCHAR(191) NULL,
    `optional_email` VARCHAR(191) NULL,
    `company_name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `readed` INTEGER NOT NULL,
    `class` VARCHAR(191) NOT NULL,
    `model_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `Notification_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipment_cat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Brand_cat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipment_cat_id` INTEGER NOT NULL,
    `brand_cat_id` INTEGER NOT NULL,
    `order_id` INTEGER NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `serial_number` VARCHAR(191) NOT NULL,
    `failure` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    INDEX `Equipment_brand_cat_id_fkey`(`brand_cat_id`),
    INDEX `Equipment_equipment_cat_id_fkey`(`equipment_cat_id`),
    INDEX `Equipment_order_id_fkey`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `customer_id` INTEGER NULL,
    `monthly_payment` VARCHAR(191) NULL,
    `interest` VARCHAR(191) NULL,
    `payment_advance` VARCHAR(191) NULL,
    `discount` VARCHAR(191) NULL,
    `flat_discount` BOOLEAN NOT NULL DEFAULT false,
    `per_diem` VARCHAR(191) NULL,
    `discount_per_diem` VARCHAR(191) NULL,
    `days_per_diem` INTEGER NULL,
    `fee` VARCHAR(191) NULL,
    `iva` VARCHAR(191) NULL,
    `comments` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `Quote_customer_id_fkey`(`customer_id`),
    INDEX `Quote_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quote_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quote_id` INTEGER NULL,
    `quantity` INTEGER NULL,
    `description` VARCHAR(191) NULL,
    `unit_price` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,

    INDEX `quote_item_quote_id_fkey`(`quote_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `comments` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `quote_id` INTEGER NULL,
    `type_income` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `Order_customer_id_fkey`(`customer_id`),
    INDEX `Order_quote_id_fkey`(`quote_id`),
    INDEX `Order_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Repair_report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NULL,
    `comments` VARCHAR(191) NULL,
    `diagnosis` VARCHAR(191) NULL,
    `solution` VARCHAR(191) NULL,
    `observations` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NULL,

    INDEX `Repair_report_order_id_fkey`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Per_diem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `vehicle` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `start_km` INTEGER NOT NULL,
    `end_km` INTEGER NOT NULL,
    `total_km` INTEGER NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `people` INTEGER NOT NULL,
    `hotel` INTEGER NOT NULL,
    `fee` INTEGER NOT NULL,
    `food` INTEGER NOT NULL,
    `vehicle_cost` INTEGER NOT NULL,
    `comments` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `Per_diem_customer_id_fkey`(`customer_id`),
    INDEX `Per_diem_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gasoline_charge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `per_diem_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Gasoline_charge_per_diem_id_idx`(`per_diem_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Extra_expense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `per_diem_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Extra_expense_per_diem_id_idx`(`per_diem_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Promissory_note` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `quantity_text` VARCHAR(191) NOT NULL,
    `quantity_digit` INTEGER NOT NULL,
    `day_text` VARCHAR(191) NOT NULL,
    `day_digit` INTEGER NOT NULL,
    `month_text` VARCHAR(191) NOT NULL,
    `month_digit` INTEGER NOT NULL,
    `year_text` VARCHAR(191) NOT NULL,
    `year_digit` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Photo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photeable_id` INTEGER NOT NULL,
    `photeable_type` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Template` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `model_type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Note` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `noteable_id` INTEGER NOT NULL,
    `noteable_type` VARCHAR(191) NOT NULL,
    `note_type` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Delivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `delivery_parcel` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `deliveriable_type` VARCHAR(191) NOT NULL,
    `deliveriable_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reminder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `remindable_type` VARCHAR(191) NOT NULL,
    `remindable_id` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `remind_at` DATETIME(3) NOT NULL,
    `reminded` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Format` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_user_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipment` ADD CONSTRAINT `Equipment_brand_fkey` FOREIGN KEY (`brand_cat_id`) REFERENCES `Brand_cat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipment` ADD CONSTRAINT `Equipment_equipment_cat_fkey` FOREIGN KEY (`equipment_cat_id`) REFERENCES `Equipment_cat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipment` ADD CONSTRAINT `Equipment_order_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_customer_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_user_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quote_item` ADD CONSTRAINT `quote_item_quote_fkey` FOREIGN KEY (`quote_id`) REFERENCES `Quote`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customer_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_quote_fkey` FOREIGN KEY (`quote_id`) REFERENCES `Quote`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_user_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repair_report` ADD CONSTRAINT `Repair_report_order_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Per_diem` ADD CONSTRAINT `Per_diem_customer_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Per_diem` ADD CONSTRAINT `Per_diem_user_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gasoline_charge` ADD CONSTRAINT `Gasoline_charge_per_diem_fkey` FOREIGN KEY (`per_diem_id`) REFERENCES `Per_diem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Extra_expense` ADD CONSTRAINT `Extra_expense_per_diem_fkey` FOREIGN KEY (`per_diem_id`) REFERENCES `Per_diem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Promissory_note` ADD CONSTRAINT `Promissory_note_customer_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_user_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

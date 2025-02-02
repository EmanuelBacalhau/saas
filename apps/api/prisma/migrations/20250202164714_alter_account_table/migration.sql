/*
  Warnings:

  - You are about to drop the column `provider_account_iid` on the `accounts` table. All the data in the column will be lost.
  - Added the required column `provider_account_id` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "provider_account_iid",
ADD COLUMN     "provider_account_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "account_verifications" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "account_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_verifications_user_id_key" ON "account_verifications"("user_id");

-- AddForeignKey
ALTER TABLE "account_verifications" ADD CONSTRAINT "account_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

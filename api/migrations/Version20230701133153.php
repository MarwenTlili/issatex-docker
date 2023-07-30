<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230701133153 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE media_object (id UUID NOT NULL, content_url VARCHAR(255) DEFAULT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN media_object.id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE "user" ADD avatar_id UUID DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN "user".avatar_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D64986383B10 FOREIGN KEY (avatar_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D64986383B10 ON "user" (avatar_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D64986383B10');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP INDEX UNIQ_8D93D64986383B10');
        $this->addSql('ALTER TABLE "user" DROP avatar_id');
    }
}

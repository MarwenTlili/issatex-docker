<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231113113126 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE article_image (id UUID NOT NULL, content_url VARCHAR(255) DEFAULT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN article_image.id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE article ADD image_id UUID DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN article.image_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E663DA5256D FOREIGN KEY (image_id) REFERENCES article_image (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_23A0E663DA5256D ON article (image_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE article DROP CONSTRAINT FK_23A0E663DA5256D');
        $this->addSql('DROP TABLE article_image');
        $this->addSql('DROP INDEX UNIQ_23A0E663DA5256D');
        $this->addSql('ALTER TABLE article DROP image_id');
    }
}

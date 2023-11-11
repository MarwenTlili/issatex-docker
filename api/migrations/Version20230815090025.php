<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230815090025 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article ADD client_id UUID DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN article.client_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E6619EB6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_23A0E6619EB6921 ON article (client_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE article DROP CONSTRAINT FK_23A0E6619EB6921');
        $this->addSql('DROP INDEX IDX_23A0E6619EB6921');
        $this->addSql('ALTER TABLE article DROP client_id');
    }
}

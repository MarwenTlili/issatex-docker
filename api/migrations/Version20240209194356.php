<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240209194356 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE production_date ADD daily_production_id UUID DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN production_date.daily_production_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE production_date ADD CONSTRAINT FK_718E7C6E3E464DC9 FOREIGN KEY (daily_production_id) REFERENCES daily_production (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_718E7C6E3E464DC9 ON production_date (daily_production_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE production_date DROP CONSTRAINT FK_718E7C6E3E464DC9');
        $this->addSql('DROP INDEX IDX_718E7C6E3E464DC9');
        $this->addSql('ALTER TABLE production_date DROP daily_production_id');
    }
}

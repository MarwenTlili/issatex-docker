<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240212133254 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE daily_production ADD production_date_id UUID NOT NULL');
        $this->addSql('COMMENT ON COLUMN daily_production.production_date_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE daily_production ADD CONSTRAINT FK_2E0E4C83AD82BBB6 FOREIGN KEY (production_date_id) REFERENCES production_date (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_2E0E4C83AD82BBB6 ON daily_production (production_date_id)');
        $this->addSql('ALTER TABLE production_date DROP CONSTRAINT fk_718e7c6e3e464dc9');
        $this->addSql('DROP INDEX idx_718e7c6e3e464dc9');
        $this->addSql('ALTER TABLE production_date DROP daily_production_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE production_date ADD daily_production_id UUID DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN production_date.daily_production_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE production_date ADD CONSTRAINT fk_718e7c6e3e464dc9 FOREIGN KEY (daily_production_id) REFERENCES daily_production (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_718e7c6e3e464dc9 ON production_date (daily_production_id)');
        $this->addSql('ALTER TABLE daily_production DROP CONSTRAINT FK_2E0E4C83AD82BBB6');
        $this->addSql('DROP INDEX IDX_2E0E4C83AD82BBB6');
        $this->addSql('ALTER TABLE daily_production DROP production_date_id');
    }
}

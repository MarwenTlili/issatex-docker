<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240209194057 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE daily_production DROP CONSTRAINT fk_2e0e4c83ad82bbb6');
        $this->addSql('DROP INDEX idx_2e0e4c83ad82bbb6');
        $this->addSql('ALTER TABLE daily_production DROP production_date_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE daily_production ADD production_date_id UUID NOT NULL');
        $this->addSql('COMMENT ON COLUMN daily_production.production_date_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE daily_production ADD CONSTRAINT fk_2e0e4c83ad82bbb6 FOREIGN KEY (production_date_id) REFERENCES production_date (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_2e0e4c83ad82bbb6 ON daily_production (production_date_id)');
    }
}

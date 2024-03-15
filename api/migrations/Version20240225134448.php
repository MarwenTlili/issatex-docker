<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240225134448 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE daily_production_quantity_id_seq CASCADE');
        $this->addSql('ALTER TABLE daily_production_quantity ALTER id TYPE UUID USING (uuid_generate_v4())');
        $this->addSql('COMMENT ON COLUMN daily_production_quantity.id IS \'(DC2Type:ulid)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SEQUENCE daily_production_quantity_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('ALTER TABLE daily_production_quantity ALTER id TYPE INT');
        $this->addSql('COMMENT ON COLUMN daily_production_quantity.id IS NULL');
    }
}

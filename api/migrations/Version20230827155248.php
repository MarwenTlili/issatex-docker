<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230827155248 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE manufacturing_order ADD technical_document_id UUID DEFAULT NULL');
        $this->addSql('ALTER TABLE manufacturing_order DROP technical_document');
        $this->addSql('COMMENT ON COLUMN manufacturing_order.technical_document_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE manufacturing_order ADD CONSTRAINT FK_34010DB1A18AE339 FOREIGN KEY (technical_document_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_34010DB1A18AE339 ON manufacturing_order (technical_document_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE manufacturing_order DROP CONSTRAINT FK_34010DB1A18AE339');
        $this->addSql('DROP INDEX UNIQ_34010DB1A18AE339');
        $this->addSql('ALTER TABLE manufacturing_order ADD technical_document VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE manufacturing_order DROP technical_document_id');
    }
}

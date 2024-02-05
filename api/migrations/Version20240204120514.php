<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240204120514 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE refresh_tokens_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE article (id UUID NOT NULL, image_id UUID DEFAULT NULL, client_id UUID DEFAULT NULL, designation VARCHAR(255) NOT NULL, model VARCHAR(255) NOT NULL, composition TEXT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_23A0E663DA5256D ON article (image_id)');
        $this->addSql('CREATE INDEX IDX_23A0E6619EB6921 ON article (client_id)');
        $this->addSql('COMMENT ON COLUMN article.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN article.image_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN article.client_id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE article_image (id UUID NOT NULL, content_url VARCHAR(255) DEFAULT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN article_image.id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE attendance (id UUID NOT NULL, date_at DATE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN attendance.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN attendance.date_at IS \'(DC2Type:date_immutable)\'');
        $this->addSql('CREATE TABLE client (id UUID NOT NULL, account_id UUID NOT NULL, name VARCHAR(255) NOT NULL, phone VARCHAR(255) NOT NULL, is_valid BOOLEAN NOT NULL, is_privileged BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C74404559B6B5FBA ON client (account_id)');
        $this->addSql('COMMENT ON COLUMN client.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN client.account_id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE company (id UUID NOT NULL, account_id UUID NOT NULL, name VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, phone VARCHAR(255) DEFAULT NULL, trn VARCHAR(255) DEFAULT NULL, description TEXT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4FBF094F9B6B5FBA ON company (account_id)');
        $this->addSql('COMMENT ON COLUMN company.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN company.account_id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE daily_production (id UUID NOT NULL, ilot_id UUID NOT NULL, weekly_schedule_id UUID NOT NULL, production_date_id UUID NOT NULL, first_choice_quantity INT NOT NULL, second_choice_quantity INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2E0E4C839A4BD21C ON daily_production (ilot_id)');
        $this->addSql('CREATE INDEX IDX_2E0E4C83DEE8743 ON daily_production (weekly_schedule_id)');
        $this->addSql('CREATE INDEX IDX_2E0E4C83AD82BBB6 ON daily_production (production_date_id)');
        $this->addSql('COMMENT ON COLUMN daily_production.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN daily_production.ilot_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN daily_production.weekly_schedule_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN daily_production.production_date_id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE employee (id UUID NOT NULL, ilot_id UUID DEFAULT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, registration_code VARCHAR(255) NOT NULL, category VARCHAR(255) DEFAULT NULL, recruitment_at DATE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_5D9F75A19A4BD21C ON employee (ilot_id)');
        $this->addSql('COMMENT ON COLUMN employee.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN employee.ilot_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN employee.recruitment_at IS \'(DC2Type:date_immutable)\'');
        $this->addSql('CREATE TABLE employee_attendance (id UUID NOT NULL, employee_id UUID NOT NULL, attendance_id UUID NOT NULL, start_at TIME(0) WITHOUT TIME ZONE NOT NULL, end_at TIME(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_F534BD458C03F15C ON employee_attendance (employee_id)');
        $this->addSql('CREATE INDEX IDX_F534BD45163DDA15 ON employee_attendance (attendance_id)');
        $this->addSql('COMMENT ON COLUMN employee_attendance.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN employee_attendance.employee_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN employee_attendance.attendance_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN employee_attendance.start_at IS \'(DC2Type:time_immutable)\'');
        $this->addSql('COMMENT ON COLUMN employee_attendance.end_at IS \'(DC2Type:time_immutable)\'');
        $this->addSql('CREATE TABLE ilot (id UUID NOT NULL, name VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_93AA979C5E237E06 ON ilot (name)');
        $this->addSql('COMMENT ON COLUMN ilot.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN ilot.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE invoice (id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, total_amount NUMERIC(10, 3) DEFAULT NULL, invoiced_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN invoice.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN invoice.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN invoice.invoiced_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE machine (id UUID NOT NULL, ilot_id UUID DEFAULT NULL, name VARCHAR(255) NOT NULL, category VARCHAR(255) NOT NULL, brand VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_1505DF849A4BD21C ON machine (ilot_id)');
        $this->addSql('COMMENT ON COLUMN machine.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN machine.ilot_id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE manufacturing_order (id UUID NOT NULL, technical_document_id UUID DEFAULT NULL, client_id UUID NOT NULL, article_id UUID NOT NULL, invoice_id UUID DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, total_quantity INT NOT NULL, unit_time INT NOT NULL, unit_price NUMERIC(10, 3) NOT NULL, total_price NUMERIC(10, 3) DEFAULT NULL, observation TEXT DEFAULT NULL, urgent BOOLEAN NOT NULL, launched BOOLEAN NOT NULL, denied BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_34010DB1A18AE339 ON manufacturing_order (technical_document_id)');
        $this->addSql('CREATE INDEX IDX_34010DB119EB6921 ON manufacturing_order (client_id)');
        $this->addSql('CREATE INDEX IDX_34010DB17294869C ON manufacturing_order (article_id)');
        $this->addSql('CREATE INDEX IDX_34010DB12989F1FD ON manufacturing_order (invoice_id)');
        $this->addSql('COMMENT ON COLUMN manufacturing_order.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN manufacturing_order.technical_document_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN manufacturing_order.client_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN manufacturing_order.article_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN manufacturing_order.invoice_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN manufacturing_order.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE manufacturing_order_size (id UUID NOT NULL, manufacturing_order_id UUID NOT NULL, size_id UUID NOT NULL, quantity INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_CFC034C860741FF8 ON manufacturing_order_size (manufacturing_order_id)');
        $this->addSql('CREATE INDEX IDX_CFC034C8498DA827 ON manufacturing_order_size (size_id)');
        $this->addSql('COMMENT ON COLUMN manufacturing_order_size.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN manufacturing_order_size.manufacturing_order_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN manufacturing_order_size.size_id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE media_object (id UUID NOT NULL, content_url VARCHAR(255) DEFAULT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN media_object.id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE package (id UUID NOT NULL, palette_id UUID NOT NULL, articles_number INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_DE686795908BC74 ON package (palette_id)');
        $this->addSql('COMMENT ON COLUMN package.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN package.palette_id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE palette (id UUID NOT NULL, manufacturing_order_id UUID NOT NULL, client_id UUID NOT NULL, articles_total_quantity INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C7E5A77E60741FF8 ON palette (manufacturing_order_id)');
        $this->addSql('CREATE INDEX IDX_C7E5A77E19EB6921 ON palette (client_id)');
        $this->addSql('COMMENT ON COLUMN palette.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN palette.manufacturing_order_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN palette.client_id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE production_date (id UUID NOT NULL, day_at DATE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN production_date.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN production_date.day_at IS \'(DC2Type:date_immutable)\'');
        $this->addSql('CREATE TABLE refresh_tokens (id INT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9BACE7E1C74F2195 ON refresh_tokens (refresh_token)');
        $this->addSql('CREATE TABLE size (id UUID NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN size.id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE technical_document (id UUID NOT NULL, content_url VARCHAR(255) DEFAULT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN technical_document.id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE "user" (id UUID NOT NULL, avatar_id UUID DEFAULT NULL, email VARCHAR(180) NOT NULL, username VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, last_login_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, is_verified BOOLEAN DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649F85E0677 ON "user" (username)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D64986383B10 ON "user" (avatar_id)');
        $this->addSql('COMMENT ON COLUMN "user".id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN "user".avatar_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN "user".created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN "user".last_login_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE weekly_schedule (id UUID NOT NULL, manufacturing_order_id UUID NOT NULL, ilot_id UUID NOT NULL, start_at DATE NOT NULL, end_at DATE NOT NULL, observation TEXT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_CA8F7CC660741FF8 ON weekly_schedule (manufacturing_order_id)');
        $this->addSql('CREATE INDEX IDX_CA8F7CC69A4BD21C ON weekly_schedule (ilot_id)');
        $this->addSql('COMMENT ON COLUMN weekly_schedule.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN weekly_schedule.manufacturing_order_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN weekly_schedule.ilot_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN weekly_schedule.start_at IS \'(DC2Type:date_immutable)\'');
        $this->addSql('COMMENT ON COLUMN weekly_schedule.end_at IS \'(DC2Type:date_immutable)\'');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E663DA5256D FOREIGN KEY (image_id) REFERENCES article_image (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E6619EB6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT FK_C74404559B6B5FBA FOREIGN KEY (account_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE company ADD CONSTRAINT FK_4FBF094F9B6B5FBA FOREIGN KEY (account_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE daily_production ADD CONSTRAINT FK_2E0E4C839A4BD21C FOREIGN KEY (ilot_id) REFERENCES ilot (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE daily_production ADD CONSTRAINT FK_2E0E4C83DEE8743 FOREIGN KEY (weekly_schedule_id) REFERENCES weekly_schedule (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE daily_production ADD CONSTRAINT FK_2E0E4C83AD82BBB6 FOREIGN KEY (production_date_id) REFERENCES production_date (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE employee ADD CONSTRAINT FK_5D9F75A19A4BD21C FOREIGN KEY (ilot_id) REFERENCES ilot (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE employee_attendance ADD CONSTRAINT FK_F534BD458C03F15C FOREIGN KEY (employee_id) REFERENCES employee (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE employee_attendance ADD CONSTRAINT FK_F534BD45163DDA15 FOREIGN KEY (attendance_id) REFERENCES attendance (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE machine ADD CONSTRAINT FK_1505DF849A4BD21C FOREIGN KEY (ilot_id) REFERENCES ilot (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE manufacturing_order ADD CONSTRAINT FK_34010DB1A18AE339 FOREIGN KEY (technical_document_id) REFERENCES technical_document (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE manufacturing_order ADD CONSTRAINT FK_34010DB119EB6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE manufacturing_order ADD CONSTRAINT FK_34010DB17294869C FOREIGN KEY (article_id) REFERENCES article (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE manufacturing_order ADD CONSTRAINT FK_34010DB12989F1FD FOREIGN KEY (invoice_id) REFERENCES invoice (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE manufacturing_order_size ADD CONSTRAINT FK_CFC034C860741FF8 FOREIGN KEY (manufacturing_order_id) REFERENCES manufacturing_order (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE manufacturing_order_size ADD CONSTRAINT FK_CFC034C8498DA827 FOREIGN KEY (size_id) REFERENCES size (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE package ADD CONSTRAINT FK_DE686795908BC74 FOREIGN KEY (palette_id) REFERENCES palette (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE palette ADD CONSTRAINT FK_C7E5A77E60741FF8 FOREIGN KEY (manufacturing_order_id) REFERENCES manufacturing_order (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE palette ADD CONSTRAINT FK_C7E5A77E19EB6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D64986383B10 FOREIGN KEY (avatar_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE weekly_schedule ADD CONSTRAINT FK_CA8F7CC660741FF8 FOREIGN KEY (manufacturing_order_id) REFERENCES manufacturing_order (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE weekly_schedule ADD CONSTRAINT FK_CA8F7CC69A4BD21C FOREIGN KEY (ilot_id) REFERENCES ilot (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE refresh_tokens_id_seq CASCADE');
        $this->addSql('ALTER TABLE article DROP CONSTRAINT FK_23A0E663DA5256D');
        $this->addSql('ALTER TABLE article DROP CONSTRAINT FK_23A0E6619EB6921');
        $this->addSql('ALTER TABLE client DROP CONSTRAINT FK_C74404559B6B5FBA');
        $this->addSql('ALTER TABLE company DROP CONSTRAINT FK_4FBF094F9B6B5FBA');
        $this->addSql('ALTER TABLE daily_production DROP CONSTRAINT FK_2E0E4C839A4BD21C');
        $this->addSql('ALTER TABLE daily_production DROP CONSTRAINT FK_2E0E4C83DEE8743');
        $this->addSql('ALTER TABLE daily_production DROP CONSTRAINT FK_2E0E4C83AD82BBB6');
        $this->addSql('ALTER TABLE employee DROP CONSTRAINT FK_5D9F75A19A4BD21C');
        $this->addSql('ALTER TABLE employee_attendance DROP CONSTRAINT FK_F534BD458C03F15C');
        $this->addSql('ALTER TABLE employee_attendance DROP CONSTRAINT FK_F534BD45163DDA15');
        $this->addSql('ALTER TABLE machine DROP CONSTRAINT FK_1505DF849A4BD21C');
        $this->addSql('ALTER TABLE manufacturing_order DROP CONSTRAINT FK_34010DB1A18AE339');
        $this->addSql('ALTER TABLE manufacturing_order DROP CONSTRAINT FK_34010DB119EB6921');
        $this->addSql('ALTER TABLE manufacturing_order DROP CONSTRAINT FK_34010DB17294869C');
        $this->addSql('ALTER TABLE manufacturing_order DROP CONSTRAINT FK_34010DB12989F1FD');
        $this->addSql('ALTER TABLE manufacturing_order_size DROP CONSTRAINT FK_CFC034C860741FF8');
        $this->addSql('ALTER TABLE manufacturing_order_size DROP CONSTRAINT FK_CFC034C8498DA827');
        $this->addSql('ALTER TABLE package DROP CONSTRAINT FK_DE686795908BC74');
        $this->addSql('ALTER TABLE palette DROP CONSTRAINT FK_C7E5A77E60741FF8');
        $this->addSql('ALTER TABLE palette DROP CONSTRAINT FK_C7E5A77E19EB6921');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D64986383B10');
        $this->addSql('ALTER TABLE weekly_schedule DROP CONSTRAINT FK_CA8F7CC660741FF8');
        $this->addSql('ALTER TABLE weekly_schedule DROP CONSTRAINT FK_CA8F7CC69A4BD21C');
        $this->addSql('DROP TABLE article');
        $this->addSql('DROP TABLE article_image');
        $this->addSql('DROP TABLE attendance');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE company');
        $this->addSql('DROP TABLE daily_production');
        $this->addSql('DROP TABLE employee');
        $this->addSql('DROP TABLE employee_attendance');
        $this->addSql('DROP TABLE ilot');
        $this->addSql('DROP TABLE invoice');
        $this->addSql('DROP TABLE machine');
        $this->addSql('DROP TABLE manufacturing_order');
        $this->addSql('DROP TABLE manufacturing_order_size');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP TABLE package');
        $this->addSql('DROP TABLE palette');
        $this->addSql('DROP TABLE production_date');
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP TABLE size');
        $this->addSql('DROP TABLE technical_document');
        $this->addSql('DROP TABLE "user"');
        $this->addSql('DROP TABLE weekly_schedule');
    }
}

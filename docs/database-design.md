# Vogelkop Data Center Database Design

---

**Document Version: 2.1**
Last Update: 19 jan 2026

## Table Of Content

---

1. [Database Overview](#database-overview)
2. [Entity Relation Diagram](#entity-relation-diagram)
3. [Authentication](#authentication)
4. [Core Table](#core-table)
5. [Data Domain Table](#data-domain-table)
6. [Junction Table](#junction-tables)
7. [Enumerations](#enumerations)
8. [Performance and Indexing](#performance-and_indexing)
9. [Documentation](#documentation)

---

## Database Overview

Database design for the **Vogelkop Data Center** application, a system **designed to manage** conservation areas under the jurisdiction of **Balai Besar KSDA Papua Barat Daya**. It supports comprehensive conservation management **by implementing** data-driven governance **principles**.

### Key Feature

- **Conservation Area Management** Facilitates multi-location management with detailed tracking for administration, spatial planning, legal frameworks, annual assessments (_METT/RAPP_), and **conflict resolution**.
- **Scientific Data Repository** Centralizes data on biodiversity, field observations, geological features, and terrain characteristics—covering both conservation areas and **surrounding landscapes** (buffer zones).
- **Socio-Economic Management** Manages socio-economic demographics and community interaction data within and around conservation areas.
- **Advanced Analytics** Provides **cross-domain analysis capabilities** to drive strategic conservation management and decision-making.
- **Organizational Collaboration** Supports multi-stakeholder engagement, including **NGO partnerships** and external organization access.

---

## Entity Relation Digaram

ERD on Progress and can be monitoring here -> ![[Normalisasi data SIDAK]]

---

## Table Design Guideline

### 1. Naming Conventions

- **Table Naming:** All tables must be prefixed with `vogelkop_` to maintain namespace consistency.
  > _Example:_ `vogelkop_users`, `vogelkop_conservation_areas`.
- **Column Naming:** Every field (column) must be prefixed with its respective table name (singular/snake_case) to ensure global uniqueness in queries.
  > _Example:_ In table `vogelkop_users`, fields should be `user_name`, `user_email`, `user_role`.

### **2. Primary Keys**

- **UUID Standard:** All Primary Keys (IDs) must use **UUID** (Universally Unique Identifier) format instead of auto-increment integers.

### **3. Audit Trails & Lifecycle (Metadata)**

Every table must include the following standard columns for auditing and soft-delete mechanisms:

- **Timestamps:**
  - `created_at` _(Timestamp)_: Record creation time.
  - `updated_at` _(Timestamp)_: Last modification time.
  - `deleted_at` _(Timestamp, Nullable)_: Timestamp when the record was soft-deleted.
- **Soft Delete Status:**
  - `is_active` _(Boolean)_: Indicator of record availability (default: `true`).
  - `deleted_by` _(UUID, Nullable)_: ID of the user who performed the soft delete.

## Authentication

vogelkop_users

| field         | type   | note                   |
| ------------- | ------ | ---------------------- |
| user_ID       | UUID   | primary key            |
| role_ID       | UUID   | foreign                |
| user_email    | string | not null               |
| user_name     | string | not null               |
| user_password | hash   | do hashing here        |
| user_avatar   | string | relative path          |
| user_verified | date   | timestamp verification |

vogelkop_account

| field               | type   | note                 |
| ------------------- | ------ | -------------------- |
| user_ID             | UUID   |                      |
| account_type        | string | adapter type         |
| acoount_provider    | string | primary key/not null |
| account_provider_ID | string | primary key/not null |
| refresh_token       | text   |                      |
| access_token        | text   |                      |
| expires_at          | int    |                      |
| token_type          | string |                      |
| account_scope       | string |                      |
| id_token            | text   |                      |
| session_state       | string |                      |

vogelkop_role

> [!must seeded] Initial seeded
>
> - guest
> - admin
> - staff

| field            | type      | note               |
| ---------------- | --------- | ------------------ |
| role_ID          | UUID      |                    |
| role_name        | string    | not null           |
| role_description | text      |                    |
| role_permission  | list/json | list of permission |

vogelkop_session

| field         | type   | note      |
| ------------- | ------ | --------- |
| session_token | string | primary   |
| user_ID       | string |           |
| expires       | date   | timestamp |

vogelkop_verification_token

| field      | type   | note |
| ---------- | ------ | ---- |
| identifier | string |      |
| token      | string |      |
| expires    | date   |      |

## Core Table

### Conservation Areas Table (Master Table)

vogelkop_conservation_areas

| field            | type   | note                    |
| ---------------- | ------ | ----------------------- |
| area_ID          | UUID   | primary key             |
| area_register    | int    | not null                |
| area_name        | string |                         |
| area_description | text   |                         |
| area_note        | text   | area status description |

vogelkop_legal_decisions

| field                | type   | note            |
| -------------------- | ------ | --------------- |
| decision_ID          | UUID   | primary key     |
| decision_name        | string | document name   |
| decision_date        | date   | approval date   |
| decision_number      | string | document number |
| decision_description | text   |                 |

vogelkop_locations

| field         | type   | note        |
| ------------- | ------ | ----------- |
| location_ID   | UUID   | primary key |
| regency_name  | string |             |
| province_name | string |             |

vogelkop_functions

| field               | type   | note        |
| ------------------- | ------ | ----------- |
| function_ID         | uuid   | primary key |
| function_name       | string |             |
| function_decription | text   |             |

---

## Data Domain Table

### Planning Table

vogelkop_zoning_blocks

| field             | type | note            |
| ----------------- | ---- | --------------- |
| block_ID          | UUID | primary key     |
| area_ID           | UUID | foreign key     |
| block_type        | enum | block type enum |
| block_description | text |                 |

vogelkop_area_plannings

| field              | type | note            |
| ------------------ | ---- | --------------- |
| plan_ID            | UUID | primary         |
| area_ID            | UUID | foreign         |
| plan_start         | date | date/ just year |
| plan_end           | date | date/ just year |
| plan_status        | enum | status enum     |
| plan_approval_date | date |                 |
| plan_description   | text |                 |

vogelkop_documents

| field                | type   | note          |
| -------------------- | ------ | ------------- |
| document_ID          | UUID   | primary       |
| area_ID              | UUID   | foreign       |
| document_name        | string |               |
| document_number      | string |               |
| document_type        | enum   |               |
| document_path        | string | relative path |
| document_cover       | string | relative path |
| document_description | text   |               |

vogelkop_ecosistem_recoveries

| field                 | type  | note                   |
| --------------------- | ----- | ---------------------- |
| recovery_ID           | UUID  | primary                |
| area_ID               | UUID  | foreign                |
| recovery_site         | int   | total site to recovery |
| recovery_area         | float | total recovary area    |
| recovery_damage_level | enum  | enum demage level      |
| cause_of_damage       | enum  |                        |
| recovery_action       | enum  |                        |

vogelkop_assessments

| field                  | type | note               |
| ---------------------- | ---- | ------------------ |
| assessment_ID          | UUID | primary            |
| area_ID                | UUID | foreign            |
| assessment_year        | int  | date/year          |
| assessment_score       | int  |                    |
| assessment_category    | enum | enum(efektive/not) |
| assessment_description | text |                    |

vogelkop_certificates_in_area

| field                   | type  | note       |
| ----------------------- | ----- | ---------- |
| certificate_ID          | UUID  | primary    |
| area_ID                 | UUID  | foreign    |
| certificate_right       | enum  | right type |
| certificate_NIB         | int   | NIB?       |
| certificate_area        | float | area in HA |
| certificate_progress    | text  |            |
| certificate_bhumi_info  | text  |            |
| certificate_description | text  |            |
| location_ID             | UUID  | foreign    |

vogelkop_build_up_areas

| field                | type   | note         |
| -------------------- | ------ | ------------ |
| buildup_ID           | UUID   | primary key  |
| area_ID              | UUID   | foreign      |
| buildup_subject_type | enum   | subject type |
| buildup_area         | float  | area HA      |
| buildup_activities   | string |              |
| buildup_year         | date   |              |
| buildup_permit       | string |              |
| buildup_layout       | string |              |
| buildup_overlap      | text   |              |
| buildup_status       | enum   |              |
| buildup_survey_year  | date   |              |
| buildup_subject_name | string |              |

---

## Junction tables

vogelkop_area_decision

| field            | type  | note    |
| ---------------- | ----- | ------- |
| area_decision_ID | UUID  | primary |
| area_ID          | UUID  |         |
| decision_ID      | UUID  |         |
| decision_area    | float | area HA |

vogelkop_area_locations

| field            | type    |
| ---------------- | ------- |
| area_location_ID | primary |
| location_ID      |         |
| area_ID          |         |
| location_area    | area HA |

vogelkop_area_functions

| field         | type |
| ------------- | ---- |
| area_function | UUID |
| function_ID   | UUID |
| area_ID       | UUID |

vogelkop_planning_documents

| field            | type | note |
| ---------------- | ---- | ---- |
| plan_document_ID | UUID |      |
| document_ID      | UUID |      |
| plan_ID          | UUID |      |

vogelkop_recovery_locations

| field                | type   |
| -------------------- | ------ |
| recovery_location_ID | UUID   |
| location_ID          | UUID   |
| recovery_ID          | UUID   |
| district_name        | String |
| village_name         | String |

vogelkop_recovery_blocks

| field             | type |
| ----------------- | ---- |
| recovery_block_ID | UUID |
| block_ID          | UUID |
| recovery_ID       | UUID |

vogelkop_buildup_locations

| field               | type   |
| ------------------- | ------ |
| buildup_location_ID | UUID   |
| location_ID         | UUID   |
| buildup_ID          | UUID   |
| district_name       | string |
| village_name        | string |

vogelkop_activity_logs

| field           | type   | note                |
| --------------- | ------ | ------------------- |
| log_ID          | UUID   | primary             |
| user_ID         | UUID   | foreign             |
| log_action_type | enum   |                     |
| entity_table    | string | table name          |
| entity_ID       | UUID   | enity id not null   |
| changes         | json   |                     |
| ip_address      | string | ip not null         |
| user_agent      | text   | user agent not null |

---

## Enumerations

```sql

CREATE TYPE block_type AS ENUM (
    'blok_pelindungan', 'blok_perlindungan_bahari', 'blok_khusus',
    'blok_rehabilitasi', 'blok_traditional', 'blok_religi', 'blok_pemanfaatan'
	);

CREATE TYPE plan_status AS ENUM (
	'active','proses_revisi', 'menunggu_ekf', 'proses_telaah', 'draft', 'konsultasi_publik', 'complete',
	);

CREATE TYPE document_type AS ENUM (
	-- legal decision document types
	'ba_tata_batas', 'sk_penunjukan', 'sk_penetapan', 'sk_penunjukan_parsial',
	-- zoning blok document type
	'penataan_blok', 'konsultasi_publik', 'evaluasi_blok', 'evaluasi_konsultasi',
	-- planning document type
	'dokumen_rpjp', 'evaluasi_rpjp', 'laporan_rpjp'
	);

CREATE TYPE recovery_damage_level AS ENUM (
	'ringan', 'berat'
	);

CREATE TYPE damage_cause AS ENUM (
    'perambahan', 'pembangunan_strategis_tak_terelakan', 'pembangunan_non_prosedural'
	);

CREATE TYPE recovery_action AS ENUM (
	'mekanisme_alam', 'restorasi'
	);

CREATE TYPE assessment_category AS ENUM (
	'efektif', 'tidak_efektif', 'belum_dilakukan_penilaian'
	);

CREATE TYPE certivicate_right AS ENUM (
	'hak_milik', 'hak_pakai', 'hak_guna_bangunan', 'tidak_ada_sertifikat', 'tanah_kosong'
	);

CREATE TYPE buildup_subject_type AS ENUM (
	'masyarakat', 'instansi_pemerintah', 'perusahaan', 'kth'
	);

CREATE TYPE buildup_status AS ENUM (
	'aktif', 'mediasi', 'eskalasi', 'koordinasi', 'terselesaikan'
	);

CREATE TYPE logs_action_type AS ENUM (
	'create', 'update', 'delete','restore','login','logout', 'export'
	);
```

---

## Performance and Indexing

```sql
-- user table indexing
CREATE INDEX idx_account_user_id ON vogelkop_accounts(user_ID)
CREATE INDEX idx_session_user_id ON vogelkop_session(user_ID)

-- foreign key indexing
CREATE INDEX idx_area_decisions_area_id ON vogelkop_area_decisions(area_ID);
CREATE INDEX idx_area_functions_area_id ON vogelkop_area_functions(area_ID);
CREATE INDEX idx_area_locations_area_id ON vogelkop_area_locations(area_ID);
CREATE INDEX idx_zoning_bloks_area_id ON vogelkop_zoning_blocks(area_ID);
CREATE INDEX idx_documents_area_id ON vogelkop_documents(area_ID);
CREATE INDEX idx_area_planning_area_id ON vogelkop_area_planning(area_ID);
CREATE INDEX idx_ecosistem_recoveries_area_id ON vogelkop_ecosistem_recoveries(area_ID);
CREATE INDEX idx_buildup_area_id ON vogelkop_build_up_areas(area_ID);
CREATE INDEX idx_certificate_area_id ON vogelkop_certificate_in_area(area_ID);

-- business logic optimization
CREATE INDEX idx_conservation_area_active ON vogelkop_areas(is_active);
CREATE INDEX idx_conservation_area_name ON vogelkop_areas(area_name);
CREATE INDEX idx_planning_status ON vogelkop_planning(plan_status);
CREATE INDEX idx_cretificate_status ON vogelkop_cretificate_in_area(certificate_status);
CREATE INDEX idx_buildup_status ON vogelkop_build_up_areas(buildup_status);

-- logs indexing
CREATE INDEX idx_logs_created_at ON vogelkop_activity_logs(create_at DESC);
CREATE INDEX idx_logs_entity ON vogelkop_activity_logs(entity_table, entity_ID);
CREATE INDEX idx_logs_user ON vogelkop_activity_logs(user_id);

```

---

### Performance Guidelines

- **Query Optimization**: Use appropriate indexes for common query patterns
- **Data Archiving**: Implement archiving strategy for historical data
- **Connection Pooling**: Configure database connection pooling
- **Monitoring**: Regular performance monitoring and optimization

---

## Documentation

### Version History

version 2.1 : add activity logs table for loggings
version 2.0 : add new table group -> Authentication
version 1.1 : add note to the document path to use relative path
version **1.0** : initial conservation core data table with planning data domain table, and performance indexing

### Maintenance

This design should be updated when:

- New data sources are integrated
- Schema changes are required
- Business rules evolve
- Performance optimization is needed

### Support

For questions about this database design:

- Review this documentation first
- Check the source CSV files for data understanding
- Validate against business requirements
- Update documentation with any changes

---

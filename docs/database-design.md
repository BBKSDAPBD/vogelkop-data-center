<div align="center">

# 🗄️ Vogelkop Data Center Database Design

**Comprehensive database architecture for conservation area management**

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-Enabled-4CAF50?style=flat-square&logo=leaflet&logoColor=white)](https://postgis.net/)

---

**Document Version:** `2.1` • **Last Updated:** 19 January 2026

</div>

---

## 📑 Table of Contents

|  #  | Section                                              | Description                      |
| :-: | ---------------------------------------------------- | -------------------------------- |
|  1  | [Database Overview](#-database-overview)             | System purpose and key features  |
|  2  | [Entity Relation Diagram](#-entity-relation-diagram) | Visual database schema           |
|  3  | [Design Guidelines](#-table-design-guidelines)       | Naming conventions and standards |
|  4  | [Authentication](#-authentication)                   | User and session management      |
|  5  | [Core Tables](#-core-tables)                         | Primary data entities            |
|  6  | [Data Domain Tables](#-data-domain-tables)           | Domain-specific data structures  |
|  7  | [Junction Tables](#-junction-tables)                 | Relationship mapping tables      |
|  8  | [Enumerations](#-enumerations)                       | Predefined value types           |
|  9  | [Performance & Indexing](#-performance-and-indexing) | Optimization strategies          |
| 10  | [Documentation](#-documentation)                     | Version history and maintenance  |

---

## 📋 Database Overview

Database design for the **Vogelkop Data Center** application—a system designed to manage conservation areas under the jurisdiction of **Balai Besar KSDA Papua Barat Daya**, implementing data-driven governance principles.

### ✨ Key Features

| Feature                             | Description                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 🏞️ **Conservation Area Management** | Multi-location tracking with administration, spatial planning, legal frameworks, annual assessments (METT/RAPP), and conflict resolution |
| 🔬 **Scientific Data Repository**   | Centralized biodiversity data, field observations, geological features, and terrain characteristics for areas and buffer zones           |
| 👥 **Socio-Economic Management**    | Demographics and community interaction data within and around conservation areas                                                         |
| 📊 **Advanced Analytics**           | Cross-domain analysis capabilities for strategic conservation decision-making                                                            |
| 🤝 **Organizational Collaboration** | Multi-stakeholder engagement including NGO partnerships and external access                                                              |

---

## 🔗 Entity Relation Diagram

> [!NOTE]
> ERD is in progress and can be monitored here → `[[Normalisasi data SIDAK]]`

---

## 📐 Table Design Guidelines

### 1️⃣ Naming Conventions

| Element     | Convention                                   | Example                                         |
| ----------- | -------------------------------------------- | ----------------------------------------------- |
| **Tables**  | Prefix with `vogelkop_`                      | `vogelkop_users`, `vogelkop_conservation_areas` |
| **Columns** | Prefix with table name (singular/snake_case) | `user_name`, `user_email`, `user_role`          |

### 2️⃣ Primary Keys

> [!IMPORTANT]
> All Primary Keys must use **UUID** (Universally Unique Identifier) format instead of auto-increment integers.

### 3️⃣ Audit Trails & Lifecycle

Every table must include these standard metadata columns:

| Column       | Type                 | Purpose                               |
| ------------ | -------------------- | ------------------------------------- |
| `created_at` | Timestamp            | Record creation time                  |
| `updated_at` | Timestamp            | Last modification time                |
| `deleted_at` | Timestamp (Nullable) | Soft-delete timestamp                 |
| `is_active`  | Boolean              | Record availability (default: `true`) |
| `deleted_by` | UUID (Nullable)      | User who performed soft delete        |

---

## 🔐 Authentication

### `vogelkop_users`

| Field           | Type   | Note                   |
| --------------- | ------ | ---------------------- |
| `user_ID`       | UUID   | 🔑 Primary Key         |
| `role_ID`       | UUID   | 🔗 Foreign Key         |
| `user_email`    | String | Not Null               |
| `user_name`     | String | Not Null               |
| `user_password` | Hash   | Hashed value           |
| `user_avatar`   | String | Relative path          |
| `user_verified` | Date   | Verification timestamp |

---

### `vogelkop_account`

| Field                 | Type   | Note                      |
| --------------------- | ------ | ------------------------- |
| `user_ID`             | UUID   | 🔗 Foreign Key            |
| `account_type`        | String | Adapter type              |
| `account_provider`    | String | 🔑 Primary Key / Not Null |
| `account_provider_ID` | String | 🔑 Primary Key / Not Null |
| `refresh_token`       | Text   |                           |
| `access_token`        | Text   |                           |
| `expires_at`          | Int    |                           |
| `token_type`          | String |                           |
| `account_scope`       | String |                           |
| `id_token`            | Text   |                           |
| `session_state`       | String |                           |

---

### `vogelkop_role`

> [!CAUTION] > **Initial Seeding Required**
>
> - `guest`
> - `admin`
> - `staff`

| Field              | Type      | Note            |
| ------------------ | --------- | --------------- |
| `role_ID`          | UUID      | 🔑 Primary Key  |
| `role_name`        | String    | Not Null        |
| `role_description` | Text      |                 |
| `role_permission`  | List/JSON | Permission list |

---

### `vogelkop_session`

| Field           | Type   | Note           |
| --------------- | ------ | -------------- |
| `session_token` | String | 🔑 Primary Key |
| `user_ID`       | String | 🔗 Foreign Key |
| `expires`       | Date   | Timestamp      |

---

### `vogelkop_verification_token`

| Field        | Type   | Note |
| ------------ | ------ | ---- |
| `identifier` | String |      |
| `token`      | String |      |
| `expires`    | Date   |      |

---

## 🏛️ Core Tables

### `vogelkop_conservation_areas` _(Master Table)_

| Field              | Type   | Note               |
| ------------------ | ------ | ------------------ |
| `area_ID`          | UUID   | 🔑 Primary Key     |
| `area_register`    | Int    | Not Null           |
| `area_name`        | String |                    |
| `area_description` | Text   |                    |
| `area_note`        | Text   | Status description |

---

### `vogelkop_legal_decisions`

| Field                  | Type   | Note            |
| ---------------------- | ------ | --------------- |
| `decision_ID`          | UUID   | 🔑 Primary Key  |
| `decision_name`        | String | Document name   |
| `decision_date`        | Date   | Approval date   |
| `decision_number`      | String | Document number |
| `decision_description` | Text   |                 |

---

### `vogelkop_locations`

| Field           | Type   | Note           |
| --------------- | ------ | -------------- |
| `location_ID`   | UUID   | 🔑 Primary Key |
| `regency_name`  | String |                |
| `province_name` | String |                |

---

### `vogelkop_functions`

| Field                  | Type   | Note           |
| ---------------------- | ------ | -------------- |
| `function_ID`          | UUID   | 🔑 Primary Key |
| `function_name`        | String |                |
| `function_description` | Text   |                |

---

## 📊 Data Domain Tables

### 📅 Planning Tables

#### `vogelkop_zoning_blocks`

| Field               | Type | Note                          |
| ------------------- | ---- | ----------------------------- |
| `block_ID`          | UUID | 🔑 Primary Key                |
| `area_ID`           | UUID | 🔗 Foreign Key                |
| `block_type`        | Enum | [`block_type`](#enumerations) |
| `block_description` | Text |                               |

---

#### `vogelkop_area_plannings`

| Field                | Type | Note                           |
| -------------------- | ---- | ------------------------------ |
| `plan_ID`            | UUID | 🔑 Primary Key                 |
| `area_ID`            | UUID | 🔗 Foreign Key                 |
| `plan_start`         | Date | Year only                      |
| `plan_end`           | Date | Year only                      |
| `plan_status`        | Enum | [`plan_status`](#enumerations) |
| `plan_approval_date` | Date |                                |
| `plan_description`   | Text |                                |

---

#### `vogelkop_documents`

| Field                  | Type   | Note                             |
| ---------------------- | ------ | -------------------------------- |
| `document_ID`          | UUID   | 🔑 Primary Key                   |
| `area_ID`              | UUID   | 🔗 Foreign Key                   |
| `document_name`        | String |                                  |
| `document_number`      | String |                                  |
| `document_type`        | Enum   | [`document_type`](#enumerations) |
| `document_path`        | String | Relative path                    |
| `document_cover`       | String | Relative path                    |
| `document_description` | Text   |                                  |

---

### 🌿 Recovery & Assessment Tables

#### `vogelkop_ecosistem_recoveries`

| Field                   | Type  | Note                                     |
| ----------------------- | ----- | ---------------------------------------- |
| `recovery_ID`           | UUID  | 🔑 Primary Key                           |
| `area_ID`               | UUID  | 🔗 Foreign Key                           |
| `recovery_site`         | Int   | Total sites                              |
| `recovery_area`         | Float | Total area (HA)                          |
| `recovery_damage_level` | Enum  | [`recovery_damage_level`](#enumerations) |
| `cause_of_damage`       | Enum  | [`damage_cause`](#enumerations)          |
| `recovery_action`       | Enum  | [`recovery_action`](#enumerations)       |

---

#### `vogelkop_assessments`

| Field                    | Type | Note                                   |
| ------------------------ | ---- | -------------------------------------- |
| `assessment_ID`          | UUID | 🔑 Primary Key                         |
| `area_ID`                | UUID | 🔗 Foreign Key                         |
| `assessment_year`        | Int  | Year                                   |
| `assessment_score`       | Int  |                                        |
| `assessment_category`    | Enum | [`assessment_category`](#enumerations) |
| `assessment_description` | Text |                                        |

---

### 📜 Certification & Build-up Tables

#### `vogelkop_certificates_in_area`

| Field                     | Type  | Note                                 |
| ------------------------- | ----- | ------------------------------------ |
| `certificate_ID`          | UUID  | 🔑 Primary Key                       |
| `area_ID`                 | UUID  | 🔗 Foreign Key                       |
| `certificate_right`       | Enum  | [`certificate_right`](#enumerations) |
| `certificate_NIB`         | Int   | NIB Number                           |
| `certificate_area`        | Float | Area (HA)                            |
| `certificate_progress`    | Text  |                                      |
| `certificate_bhumi_info`  | Text  |                                      |
| `certificate_description` | Text  |                                      |
| `location_ID`             | UUID  | 🔗 Foreign Key                       |

---

#### `vogelkop_build_up_areas`

| Field                  | Type   | Note                                    |
| ---------------------- | ------ | --------------------------------------- |
| `buildup_ID`           | UUID   | 🔑 Primary Key                          |
| `area_ID`              | UUID   | 🔗 Foreign Key                          |
| `buildup_subject_type` | Enum   | [`buildup_subject_type`](#enumerations) |
| `buildup_area`         | Float  | Area (HA)                               |
| `buildup_activities`   | String |                                         |
| `buildup_year`         | Date   |                                         |
| `buildup_permit`       | String |                                         |
| `buildup_layout`       | String |                                         |
| `buildup_overlap`      | Text   |                                         |
| `buildup_status`       | Enum   | [`buildup_status`](#enumerations)       |
| `buildup_survey_year`  | Date   |                                         |
| `buildup_subject_name` | String |                                         |

---

## 🔀 Junction Tables

### Area Relationships

#### `vogelkop_area_decision`

| Field              | Type  | Note           |
| ------------------ | ----- | -------------- |
| `area_decision_ID` | UUID  | 🔑 Primary Key |
| `area_ID`          | UUID  | 🔗 Foreign Key |
| `decision_ID`      | UUID  | 🔗 Foreign Key |
| `decision_area`    | Float | Area (HA)      |

---

#### `vogelkop_area_locations`

| Field              | Type  | Note           |
| ------------------ | ----- | -------------- |
| `area_location_ID` | UUID  | 🔑 Primary Key |
| `location_ID`      | UUID  | 🔗 Foreign Key |
| `area_ID`          | UUID  | 🔗 Foreign Key |
| `location_area`    | Float | Area (HA)      |

---

#### `vogelkop_area_functions`

| Field           | Type | Note           |
| --------------- | ---- | -------------- |
| `area_function` | UUID | 🔑 Primary Key |
| `function_ID`   | UUID | 🔗 Foreign Key |
| `area_ID`       | UUID | 🔗 Foreign Key |

---

### Document & Planning Relationships

#### `vogelkop_planning_documents`

| Field              | Type | Note           |
| ------------------ | ---- | -------------- |
| `plan_document_ID` | UUID | 🔑 Primary Key |
| `document_ID`      | UUID | 🔗 Foreign Key |
| `plan_ID`          | UUID | 🔗 Foreign Key |

---

### Recovery Relationships

#### `vogelkop_recovery_locations`

| Field                  | Type   | Note           |
| ---------------------- | ------ | -------------- |
| `recovery_location_ID` | UUID   | 🔑 Primary Key |
| `location_ID`          | UUID   | 🔗 Foreign Key |
| `recovery_ID`          | UUID   | 🔗 Foreign Key |
| `district_name`        | String |                |
| `village_name`         | String |                |

---

#### `vogelkop_recovery_blocks`

| Field               | Type | Note           |
| ------------------- | ---- | -------------- |
| `recovery_block_ID` | UUID | 🔑 Primary Key |
| `block_ID`          | UUID | 🔗 Foreign Key |
| `recovery_ID`       | UUID | 🔗 Foreign Key |

---

### Build-up Relationships

#### `vogelkop_buildup_locations`

| Field                 | Type   | Note           |
| --------------------- | ------ | -------------- |
| `buildup_location_ID` | UUID   | 🔑 Primary Key |
| `location_ID`         | UUID   | 🔗 Foreign Key |
| `buildup_ID`          | UUID   | 🔗 Foreign Key |
| `district_name`       | String |                |
| `village_name`        | String |                |

---

### Activity Logging

#### `vogelkop_activity_logs`

| Field             | Type   | Note                                |
| ----------------- | ------ | ----------------------------------- |
| `log_ID`          | UUID   | 🔑 Primary Key                      |
| `user_ID`         | UUID   | 🔗 Foreign Key                      |
| `log_action_type` | Enum   | [`logs_action_type`](#enumerations) |
| `entity_table`    | String | Table name                          |
| `entity_ID`       | UUID   | Not Null                            |
| `changes`         | JSON   |                                     |
| `ip_address`      | String | Not Null                            |
| `user_agent`      | Text   | Not Null                            |

---

## 🏷️ Enumerations

### Block Types

```sql
CREATE TYPE block_type AS ENUM (
    'blok_pelindungan',
    'blok_perlindungan_bahari',
    'blok_khusus',
    'blok_rehabilitasi',
    'blok_traditional',
    'blok_religi',
    'blok_pemanfaatan'
);
```

### Plan Status

```sql
CREATE TYPE plan_status AS ENUM (
    'active',
    'proses_revisi',
    'menunggu_ekf',
    'proses_telaah',
    'draft',
    'konsultasi_publik',
    'complete'
);
```

### Document Types

```sql
CREATE TYPE document_type AS ENUM (
    -- Legal decision document types
    'ba_tata_batas',
    'sk_penunjukan',
    'sk_penetapan',
    'sk_penunjukan_parsial',
    -- Zoning block document types
    'penataan_blok',
    'konsultasi_publik',
    'evaluasi_blok',
    'evaluasi_konsultasi',
    -- Planning document types
    'dokumen_rpjp',
    'evaluasi_rpjp',
    'laporan_rpjp'
);
```

### Recovery & Damage Types

```sql
CREATE TYPE recovery_damage_level AS ENUM (
    'ringan',
    'berat'
);

CREATE TYPE damage_cause AS ENUM (
    'perambahan',
    'pembangunan_strategis_tak_terelakan',
    'pembangunan_non_prosedural'
);

CREATE TYPE recovery_action AS ENUM (
    'mekanisme_alam',
    'restorasi'
);
```

### Assessment Categories

```sql
CREATE TYPE assessment_category AS ENUM (
    'efektif',
    'tidak_efektif',
    'belum_dilakukan_penilaian'
);
```

### Certificate Rights

```sql
CREATE TYPE certificate_right AS ENUM (
    'hak_milik',
    'hak_pakai',
    'hak_guna_bangunan',
    'tidak_ada_sertifikat',
    'tanah_kosong'
);
```

### Build-up Types & Status

```sql
CREATE TYPE buildup_subject_type AS ENUM (
    'masyarakat',
    'instansi_pemerintah',
    'perusahaan',
    'kth'
);

CREATE TYPE buildup_status AS ENUM (
    'aktif',
    'mediasi',
    'eskalasi',
    'koordinasi',
    'terselesaikan'
);
```

### Action Log Types

```sql
CREATE TYPE logs_action_type AS ENUM (
    'create',
    'update',
    'delete',
    'restore',
    'login',
    'logout',
    'export'
);
```

---

## ⚡ Performance and Indexing

### User Table Indexing

```sql
CREATE INDEX idx_account_user_id ON vogelkop_accounts(user_ID);
CREATE INDEX idx_session_user_id ON vogelkop_session(user_ID);
```

### Foreign Key Indexing

```sql
CREATE INDEX idx_area_decisions_area_id ON vogelkop_area_decisions(area_ID);
CREATE INDEX idx_area_functions_area_id ON vogelkop_area_functions(area_ID);
CREATE INDEX idx_area_locations_area_id ON vogelkop_area_locations(area_ID);
CREATE INDEX idx_zoning_bloks_area_id ON vogelkop_zoning_blocks(area_ID);
CREATE INDEX idx_documents_area_id ON vogelkop_documents(area_ID);
CREATE INDEX idx_area_planning_area_id ON vogelkop_area_planning(area_ID);
CREATE INDEX idx_ecosistem_recoveries_area_id ON vogelkop_ecosistem_recoveries(area_ID);
CREATE INDEX idx_buildup_area_id ON vogelkop_build_up_areas(area_ID);
CREATE INDEX idx_certificate_area_id ON vogelkop_certificate_in_area(area_ID);
```

### Business Logic Optimization

```sql
CREATE INDEX idx_conservation_area_active ON vogelkop_areas(is_active);
CREATE INDEX idx_conservation_area_name ON vogelkop_areas(area_name);
CREATE INDEX idx_planning_status ON vogelkop_planning(plan_status);
CREATE INDEX idx_certificate_status ON vogelkop_certificate_in_area(certificate_status);
CREATE INDEX idx_buildup_status ON vogelkop_build_up_areas(buildup_status);
```

### Activity Logs Indexing

```sql
CREATE INDEX idx_logs_created_at ON vogelkop_activity_logs(created_at DESC);
CREATE INDEX idx_logs_entity ON vogelkop_activity_logs(entity_table, entity_ID);
CREATE INDEX idx_logs_user ON vogelkop_activity_logs(user_id);
```

### 📈 Performance Guidelines

| Strategy                  | Recommendation                                    |
| ------------------------- | ------------------------------------------------- |
| 🔍 **Query Optimization** | Use appropriate indexes for common query patterns |
| 📦 **Data Archiving**     | Implement archiving strategy for historical data  |
| 🔌 **Connection Pooling** | Configure database connection pooling             |
| 📊 **Monitoring**         | Regular performance monitoring and optimization   |

---

## 📚 Documentation

### 📜 Version History

| Version | Changes                                                                            |
| :-----: | ---------------------------------------------------------------------------------- |
| **2.1** | Added `activity_logs` table for logging                                            |
| **2.0** | Added Authentication table group                                                   |
| **1.1** | Added note for relative path in document storage                                   |
| **1.0** | Initial conservation core data table with planning domain and performance indexing |

### 🔧 Maintenance

> [!TIP]
> This design should be updated when:
>
> - New data sources are integrated
> - Schema changes are required
> - Business rules evolve
> - Performance optimization is needed

### 💬 Support

For questions about this database design:

1. 📖 Review this documentation first
2. 📊 Check the source CSV files for data understanding
3. ✅ Validate against business requirements
4. 📝 Update documentation with any changes

---

<div align="center">

**Vogelkop Data Center** • Database Design Document

_Balai Besar KSDA Papua Barat Daya_

</div>

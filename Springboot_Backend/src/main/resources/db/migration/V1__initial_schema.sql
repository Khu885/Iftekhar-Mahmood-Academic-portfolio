CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ NULL
);

CREATE TABLE file_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255),
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_data BYTEA NOT NULL,
    checksum VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(180) NOT NULL UNIQUE,
    title VARCHAR(300) NOT NULL,
    subtitle VARCHAR(500),
    author VARCHAR(300),
    publisher VARCHAR(300),
    publication_year INTEGER,
    isbn VARCHAR(30),
    description TEXT,
    category VARCHAR(150),
    external_book_url VARCHAR(1000),
    pdf_external_url VARCHAR(1000),
    pdf_asset_id UUID REFERENCES file_assets(id),
    cover_asset_id UUID REFERENCES file_assets(id),
    display_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(180) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    authors TEXT,
    journal VARCHAR(300),
    publication_year INTEGER,
    volume VARCHAR(50),
    issue VARCHAR(50),
    pages VARCHAR(100),
    abstract TEXT,
    citation TEXT,
    doi VARCHAR(255),
    original_publication_url VARCHAR(1000),
    pdf_external_url VARCHAR(1000),
    pdf_asset_id UUID REFERENCES file_assets(id),
    display_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE publication_tags (
    publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    display_order INTEGER NOT NULL,
    tag VARCHAR(150) NOT NULL,
    PRIMARY KEY (publication_id, display_order)
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(180) NOT NULL UNIQUE,
    title VARCHAR(300) NOT NULL,
    category VARCHAR(200),
    status VARCHAR(150),
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    highlight_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE cv_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    asset_id UUID REFERENCES file_assets(id),
    external_url VARCHAR(1000),
    active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cv_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_type VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    visible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE cv_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES cv_sections(id) ON DELETE CASCADE,
    heading VARCHAR(500),
    organization VARCHAR(500),
    location VARCHAR(300),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES admin_users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    details JSONB
);

CREATE INDEX idx_books_slug ON books(slug);
CREATE INDEX idx_books_published_order ON books(published, display_order);
CREATE INDEX idx_publications_slug ON publications(slug);
CREATE INDEX idx_publications_published_order ON publications(published, display_order);
CREATE INDEX idx_publication_tags_publication ON publication_tags(publication_id, display_order);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_published_order ON projects(published, display_order);
CREATE INDEX idx_project_highlights_project ON project_highlights(project_id, display_order);
CREATE INDEX idx_cv_entries_section ON cv_entries(section_id, display_order);

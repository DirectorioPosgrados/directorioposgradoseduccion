-- ── Tabla principal del directorio ────────────────────────
CREATE TABLE IF NOT EXISTS directorio_posgrados (
  id              BIGSERIAL PRIMARY KEY,
  id_programa     TEXT,
  nombre          TEXT NOT NULL,
  universidad     TEXT NOT NULL,
  tipo_institucion TEXT,
  pais            TEXT NOT NULL,
  nivel           TEXT NOT NULL,
  enfoque_programa TEXT,
  modalidad       TEXT,
  duracion        INTEGER,
  costo_usd       NUMERIC,
  url_programa    TEXT,
  requisito_grado TEXT,
  convalidable    TEXT,
  slug            TEXT NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para filtros frecuentes del catálogo
CREATE INDEX IF NOT EXISTS idx_dp_pais     ON directorio_posgrados(pais);
CREATE INDEX IF NOT EXISTS idx_dp_nivel    ON directorio_posgrados(nivel);
CREATE INDEX IF NOT EXISTS idx_dp_modalidad ON directorio_posgrados(modalidad);
CREATE INDEX IF NOT EXISTS idx_dp_slug     ON directorio_posgrados(slug);

-- ── Tabla de leads (modal de primer acceso) ───────────────
CREATE TABLE IF NOT EXISTS leads (
  id         BIGSERIAL PRIMARY KEY,
  nombre     TEXT NOT NULL,
  apellido   TEXT NOT NULL,
  telefono   TEXT NOT NULL,
  correo     TEXT NOT NULL,
  pais       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
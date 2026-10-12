#!/usr/bin/env node
// Hook de PostToolUse: formatea con Prettier el archivo que Claude Code
// acaba de crear o editar (Edit/Write/MultiEdit).
//
// Usa la API de Prettier en vez de invocar un binario por shell, para que
// funcione igual en Windows/PowerShell que en bash, sin depender de npx
// ni de cómo el shell maneje rutas con espacios (como la de este repo).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';
import * as prettier from 'prettier';

const SUPPORTED_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.css',
  '.json',
  '.md',
  '.html',
  '.yml',
  '.yaml',
]);

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

async function main() {
  const raw = readStdin();
  if (!raw) return;

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return;
  }

  const filePath = input?.tool_input?.file_path;
  if (!filePath || !existsSync(filePath) || !SUPPORTED_EXTENSIONS.has(extname(filePath))) {
    return;
  }

  try {
    const config = await prettier.resolveConfig(filePath);
    const source = readFileSync(filePath, 'utf8');
    const formatted = await prettier.format(source, { ...config, filepath: filePath });
    if (formatted !== source) {
      writeFileSync(filePath, formatted, 'utf8');
    }
  } catch (error) {
    // Nunca bloqueamos la edición de Claude por un error de formato,
    // solo lo dejamos registrado.
    console.error(`[format-on-write] no se pudo formatear ${filePath}:`, error.message);
  }
}

main();

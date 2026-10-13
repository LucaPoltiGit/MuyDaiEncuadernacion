import { describe, expect, it } from 'vitest';
import { isNotebookConfiguration } from './guards';
import { buildConfiguration } from './testFixture';

describe('isNotebookConfiguration', () => {
  it('acepta una configuración completa', () => {
    expect(isNotebookConfiguration(buildConfiguration())).toBe(true);
  });

  it('rechaza valores incompletos o de otro tipo', () => {
    expect(isNotebookConfiguration(null)).toBe(false);
    expect(isNotebookConfiguration('a5')).toBe(false);
    expect(isNotebookConfiguration({ ...buildConfiguration(), sheets: '80' })).toBe(false);
    expect(isNotebookConfiguration({ ...buildConfiguration(), sheets: Number.NaN })).toBe(false);
    const withoutFabric: Record<string, unknown> = { ...buildConfiguration() };
    delete withoutFabric.fabricId;
    expect(isNotebookConfiguration(withoutFabric)).toBe(false);
  });
});

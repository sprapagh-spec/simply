"use client";
import { useMemo, useState } from 'react';
import Papa from 'papaparse';
import { validateAndPreview, commitImport } from './actions';

type Row = Record<string, string>;

type Mapping = {
  email: string | null;
  first_name: string;
  last_name: string;
  household: string | null;
  address: string | null;
};

const defaultFields = ['email', 'first_name', 'last_name', 'household', 'address'] as const;

export default function ImportGuestsPage() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Row[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mapping, setMapping] = useState<Mapping | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function onFile(file: File) {
    setFileName(file.name);
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = (results.data as Row[]).filter((r) => Object.keys(r).length > 0);
        setRawRows(data);
        const hdrs = results.meta.fields ?? Object.keys(data[0] ?? {});
        setHeaders(hdrs);
        // naive auto-map
        const lower = hdrs.map((h) => h.toLowerCase());
        const pick = (candidates: string[]) => {
          for (const c of candidates) {
            const i = lower.indexOf(c);
            if (i !== -1) return hdrs[i];
          }
          return null;
        };
        setMapping({
          email: pick(['email']) ,
          first_name: pick(['first_name', 'first name', 'firstname']) ?? hdrs[0] ?? '',
          last_name: pick(['last_name', 'last name', 'lastname']) ?? hdrs[1] ?? '',
          household: pick(['household', 'household name']),
          address: pick(['address', 'street']),
        });
      },
    });
  }

  const mappedRows = useMemo(() => {
    if (!mapping) return [] as Row[];
    return rawRows.map((r) => ({
      email: mapping.email ? r[mapping.email] ?? '' : '',
      first_name: r[mapping.first_name] ?? '',
      last_name: r[mapping.last_name] ?? '',
      household: mapping.household ? r[mapping.household] ?? '' : '',
      address: mapping.address ? r[mapping.address] ?? '' : '',
    }));
  }, [rawRows, mapping]);

  async function onPreview() {
    const res = await validateAndPreview({ rows: mappedRows });
    setPreview(res);
  }

  async function onCommit() {
    if (!preview) return;
    setSubmitting(true);
    try {
      await commitImport({ rows: preview.cleaned });
      alert('Import committed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Import Guests</h1>
      <div className="mt-4 rounded border p-6">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        {fileName && <p className="mt-2 text-sm text-muted-foreground">Loaded {fileName}</p>}
      </div>

      {headers.length > 0 && mapping && (
        <div className="mt-6 rounded border p-4">
          <h2 className="font-medium">Map Columns</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {defaultFields.map((f) => (
              <label key={f} className="flex items-center gap-2 text-sm">
                <span className="w-28 capitalize">{f.replace('_', ' ')}</span>
                <select
                  className="w-full rounded border bg-background p-2"
                  value={(mapping as any)[f] ?? ''}
                  onChange={(e) => setMapping({ ...mapping, [f]: e.target.value || null })}
                >
                  <option value="">—</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button
            className="mt-4 rounded bg-primary px-3 py-2 text-primary-foreground text-sm"
            onClick={onPreview}
          >
            Validate & Preview
          </button>
        </div>
      )}

      {preview && (
        <div className="mt-6 space-y-4">
          <div className="rounded border p-4">
            <h3 className="font-medium">Validation</h3>
            <p className="text-sm text-muted-foreground">Valid rows: {preview.cleaned.length}, Errors: {preview.errors.length}</p>
            {preview.errors.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm">
                {preview.errors.slice(0, 5).map((e: any, i: number) => (
                  <li key={i}>Row {e.index + 1}: {e.issues.join(', ')}</li>
                ))}
                {preview.errors.length > 5 && <li>…and more</li>}
              </ul>
            )}
          </div>
          <div className="rounded border p-4">
            <h3 className="font-medium">Duplicates Detected</h3>
            <p className="text-sm text-muted-foreground">{preview.duplicates.length} potential duplicates</p>
          </div>
          <div className="rounded border p-4">
            <h3 className="font-medium">Household Inference</h3>
            <p className="text-sm text-muted-foreground">{preview.households.length} inferred groups</p>
          </div>
          <button
            className="rounded bg-primary px-3 py-2 text-primary-foreground text-sm disabled:opacity-50"
            onClick={onCommit}
            disabled={submitting || preview.cleaned.length === 0}
          >
            {submitting ? 'Committing…' : 'Commit Import'}
          </button>
        </div>
      )}
    </main>
  );
}


import React, { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { SimulationBadge } from '../components/SimulationBadge';
import { RegionId, UserRole } from '../lib/types';
import { useDermaStore } from '../store/useDermaStore';

export const Module08UserManagement: React.FC = () => {
  const { managedUsers, addManagedUser, toggleUserActive } = useDermaStore();
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('klinik');
  const [institution, setInstitution] = useState('');
  const [region, setRegion] = useState<RegionId>('DIY');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !institution.trim()) return;
    const scopeMap: Record<UserRole, string> = {
      klinik: 'Sitologi, Voucher, Rekomendasi, Log Resep',
      lab: 'Unggah Kultur, Antibiogram, Konfirmasi Lab',
      regulator: 'Monev, Antibiogram, Jejak Resep, Persetujuan',
      pemilik: 'Edukasi Rumah, Pengingat Terapi, Consent Granular',
    };
    addManagedUser({
      name: name.trim(),
      role,
      institution: institution.trim(),
      region,
      accessScope: scopeMap[role],
      active: true,
    });
    setName('');
    setInstitution('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-teal-400">
            <span className="h-2 w-2 rounded-full bg-teal-400" aria-hidden="true" />
            <span>MODUL 08 • GOVERNANCE • MANAJEMEN PENGGUNA</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-white">
            Kontrol Akses Berbasis Peran (RBAC) & Akun Simulasi
          </h2>
        </div>
        <SimulationBadge />
      </div>

      {/* Add User Form */}
      <form
        onSubmit={handleAdd}
        className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5"
      >
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-teal-400" aria-hidden="true" />
          <h3 className="font-display text-base font-bold text-white">
            Tambah Akun Pengguna Baru (Simulasi)
          </h3>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama fiktif + gelar"
            aria-label="Nama pengguna baru"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500"
          />
          <input
            type="text"
            required
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="Instansi fiktif"
            aria-label="Instansi pengguna"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            aria-label="Pilih peran"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
          >
            <option value="klinik">Klinik</option>
            <option value="lab">Laboratorium</option>
            <option value="regulator">Regulator</option>
            <option value="pemilik">Pemilik</option>
          </select>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionId)}
            aria-label="Pilih wilayah"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
          >
            <option value="DIY">DIY</option>
            <option value="Jateng">Jateng</option>
            <option value="Jabodetabek">Jabodetabek</option>
            <option value="Bali">Bali</option>
          </select>
          <button
            type="submit"
            className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-400"
          >
            Tambah Pengguna
          </button>
        </div>
      </form>

      {/* Users Table */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-teal-400" aria-hidden="true" />
          <h3 className="font-display text-base font-bold text-white">
            Daftar Pengguna Terdaftar ({managedUsers.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-2.5 pr-4">Pengguna</th>
                <th className="py-2.5 pr-4">Peran</th>
                <th className="py-2.5 pr-4">Instansi (Fiktif)</th>
                <th className="py-2.5 pr-4">Hak Akses</th>
                <th className="py-2.5 pr-4">Status</th>
                <th className="py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {managedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-white">{u.name}</p>
                    <p className="font-mono text-[11px] text-slate-400">
                      {u.id} • {u.region}
                    </p>
                  </td>
                  <td className="py-3 pr-4 font-mono uppercase text-teal-300">{u.role}</td>
                  <td className="py-3 pr-4 text-slate-300">{u.institution}</td>
                  <td className="py-3 pr-4 text-slate-400">{u.accessScope}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${
                        u.active
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
                      {u.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleUserActive(u.id)}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-teal-400"
                    >
                      {u.active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

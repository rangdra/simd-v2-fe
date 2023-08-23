export interface IUser {
  avatar: string;
  email: string;
  fromGoogle: boolean;
  fullname: string;
  isAdmin: boolean;
  username: string;
  createdAt: Date;
  _id: string;
  mahasiswa: IMahasiswa;
  role: ERoleType;
}

export interface IMahasiswa {
  fullname: string;
  nim: string;
  jurusan: string;
  jenjang: string;
  _id?: string;
}

export interface IKeputusan {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
}

export interface IKriteria {
  _id: string;
  title: string;
  kode: string;
  bobot: number;
  normalisasi: number;
  tipe: 'benefit' | 'cost';
  subKriteria: ISubKriteria[];
  keputusanId: IKeputusan;
}

export interface IKriteriaItem {
  _id: string;
  kriteria: string;
  kode: string;
  bobot: number;
  normalisasi: number;
  tipe: 'benefit' | 'cost';
  subKriteria: ISubKriteria[];
  keputusanId: IKeputusan;
}

export interface ISubKriteria {
  nilai: number;
  subKriteria: string;
  _id: string;
  kriteriaId: IKriteriaItem;
}

export interface IAlternatif {
  _id: string;
  title: string;
  kode: string;
  keputusanId: IKeputusan;
}

export interface IPenilaianAlternatif {
  _id: string;
  alternatifId: IAlternatif;
  kriteriaTerpilih: {
    subKriteriaId: ISubKriteria;
    nilai_utility: number;
    nilai_akhir: number;
  }[];
  keputusanId: IKeputusan;
  total_nilai: number;
}
export enum ERoleType {
  admin = 'admin',
  mahasiswa = 'mahasiswa',
  super_admin = 'super_admin',
}

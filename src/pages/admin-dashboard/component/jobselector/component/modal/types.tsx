import { type Job } from "@/features/jobs";
export type cityProps = {
  _id?: string;
  name?: string;
};

export type departmentProps = {
  _id?: string;
  name?: string;
};

export type companyProps = {
  _id?: string;
  name?: string;
  address?: string;
  cityId?: string;
  cityname?: string;
};

export type submitLabelProps = {
  loading?: string;
  label?: string;
};

export interface AddModalProps {
  handleCloseModal: () => void;
  handleActions: (e: React.FormEvent<HTMLFormElement>) => void;
  loaders: boolean;
  companies: companyProps[];
  cities: cityProps[];
  departments: departmentProps[];
  title: string;
  editJob?: Job;
  submitLabel?: submitLabelProps;
}
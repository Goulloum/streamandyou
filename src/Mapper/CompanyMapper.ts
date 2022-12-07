import { Company } from "../Model/Company";

export interface CompanyDTO {
    id: number;
    name: string;
}

export class CompanyMapper {
    public static toDTO = (companyModel: Company): CompanyDTO => {
        return {
            id: companyModel.id,
            name: companyModel.dataValues.name,
        };
    };
}

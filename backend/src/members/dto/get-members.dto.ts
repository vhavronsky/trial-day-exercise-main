import { Transform } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export enum SortField {
  NAME = "name",
  EMAIL = "email",
  ROLE = "role",
  LAST_LOGIN_AT = "lastLoginAt",
  TEAMS = "teams",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export class GetMembersDto {
  // ==================== PAGINATION ====================

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  // ==================== FILTERS ====================

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return value.split(",");
    return [value];
  })
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  @IsBoolean()
  isGuest?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return value.split(",");
    return [value];
  })
  @IsArray()
  @IsString({ each: true })
  teamIds?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  @IsBoolean()
  hasNoTeam?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  // ==================== SORTING ====================

  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}

import { InjectionKey } from "vue";
import { UpdateSettingFieldFunction, AddSettingRowFunction, RemoveSettingRowFunction, GetFullIriFunction, FetchShapesFunction } from "@/types/shape";

export const updateSettingFieldKey: InjectionKey<UpdateSettingFieldFunction> = Symbol(
  "updateSettingField"
);

export const addSettingRowKey: InjectionKey<AddSettingRowFunction> = Symbol(
  "addSettingRow"
);

export const removeSettingRowKey: InjectionKey<RemoveSettingRowFunction> = Symbol(
  "removeSettingRow"
);

export const getFullIriKey: InjectionKey<GetFullIriFunction> = Symbol(
  "getFullIri"
);

export const fetchShapesKey: InjectionKey<FetchShapesFunction> = Symbol(
  "fetchShapes"
);



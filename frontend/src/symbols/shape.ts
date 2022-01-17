import { InjectionKey } from "vue";
import { UpdateSettingFieldFunction, AddSettingRowFunction, RemoveSettingRowFunction } from "@/types/shape";

export const updateSettingFieldKey: InjectionKey<UpdateSettingFieldFunction> = Symbol(
  "updateSettingField"
);

export const addSettingRowKey: InjectionKey<AddSettingRowFunction> = Symbol(
  "addSettingRow"
);

export const removeSettingRowKey: InjectionKey<RemoveSettingRowFunction> = Symbol(
  "removeSettingRow"
);

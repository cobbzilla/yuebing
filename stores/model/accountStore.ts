// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { Ref } from "vue";
import { defineStore } from "pinia";
import { MobilettoOrmValidationErrors } from "mobiletto-orm";
import { AccountType, AccountTypeDef } from "yuebing-model";
import { accountService } from "~/utils/services/model/accountService";
import { MobilettoOrmFindApiOpts } from "~/utils/search";
import { updateOrmList } from "~/utils/orm";

const updateList = (list: AccountType[] | null, id: string, opts?: { object?: AccountType; remove?: boolean }) => {
  return updateOrmList<AccountType>(AccountTypeDef, list, id, opts);
};

export const useAccountStore = defineStore("account", {
  state: () => ({
    finding: false,
    found: null as AccountType | null,
    creating: false,
    created: null as AccountType | null,
    updating: false,
    updated: null as AccountType | null,
    deleting: false,
    deleted: null as boolean | null,
    searching: false,
    accountList: null as AccountType[] | null,
  }),
  getters: {
      accountBusy: (state) => state.finding || state.creating || state.updating || state.deleting || state.searching,
  },
  actions: {
    async lookup(id: string, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<AccountType> {
      this.found = null;
      this.finding = true;
      try {
        this.found = await accountService.findAccount(id, serverErrors);
        updateList(this.accountList, AccountTypeDef.id(this.found), {object: this.found});
        return this.found;
      } finally {
        this.finding = false;
      }
    },
    async search(query?: MobilettoOrmFindApiOpts): Promise<AccountType[]> {
      try {
        this.searching = true;
        this.accountList = await accountService.searchAccount(query);
        return this.accountList || [];
      } finally {
        this.searching = false;
      }
    },
    async create(object: AccountType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<AccountType> {
      try {
        this.created = null;
        this.creating = true;
        this.created = await accountService.createAccount(object, serverErrors);
        return this.created;
      } finally {
        this.creating = false;
      }
    },
    async update(object: AccountType, serverErrors: Ref<MobilettoOrmValidationErrors>): Promise<AccountType> {
      try {
        this.updated = null;
        this.updating = true;
        this.updated = await accountService.updateAccount(object, serverErrors);
        updateList(this.accountList, AccountTypeDef.id(this.updated), {object: this.updated});
        return this.updated;
      } finally {
        this.updating = false;
      }
    },
    async delete(id: string, serverErrors: Ref<MobilettoOrmValidationErrors>, purge?: boolean): Promise<boolean> {
      try {
        this.deleted = null;
        this.deleting = true;
        const deleteResult = await accountService.deleteAccount(id, serverErrors, !!purge);
        if (deleteResult) {
          updateList(this.accountList, id, {remove: true});
          this.deleted = true;
        } else {
          this.deleted = false;
        }
        return this.deleted;
      } finally {
        this.deleting = false;
      }
    },
  },
});

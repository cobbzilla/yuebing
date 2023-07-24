// DO NOT EDIT THIS FILE. AUTO-GENERATED BY mobiletto-orm-typedef-gen

import { defineStore } from "pinia";
import { AccountType, AccountTypeDef } from "yuebing-model";
import { accountService } from "~/utils/services/model/accountService";

const updateList = (list: AccountType[] | null, id: string, remove?: { remove?: boolean }) => {
  if (list) {
    const foundIndex = list.findIndex((e) => AccountTypeDef.id(e) === id);
    if (foundIndex && foundIndex >= 0) {
      if (remove && remove.remove === true) {
        list.splice(foundIndex, 1);
      } else {
        list.splice(foundIndex, 1, this.account);
      }
    }
  }
};

export const useAccountStore = defineStore("account", {
  state: () => ({
    account: null as AccountType | null,
    accountList: null as AccountType[] | null,
  }),
  actions: {
    async accountLookup(id: string): Promise<void> {
      this.account = await accountService.findAccount(id);
      updateList(this.accountList, AccountTypeDef.id(this.account));
    },
    async accountSearch(query?: MobilettoOrmFindApiOpts): Promise<void> {
      this.accountList = await accountService.searchAccount(query);
    },
    async accountCreate(account: AccountType): Promise<void> {
      this.account = await accountService.createAccount(account);
      updateList(this.accountList, AccountTypeDef.id(this.account));
    },
    async accountUpdate(account: AccountType): Promise<void> {
      this.account = await accountService.updateAccount(account);
      updateList(this.accountList, AccountTypeDef.id(this.account));
    },
    async accountDelete(account: string): Promise<void> {
      await accountService.deleteAccount(account);
      updateList(this.accountList, account, { remove: true });
    },
  },
});

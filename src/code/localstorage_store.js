const storage_key = "storage_dev"


class DataStore {
    constructor(name, storage_key) {
        this.name = name;
        this.storage_key = storage_key;
        this.validator = null;
    }

    /**
     *
     * @returns The data from the localstorage assosiated with this DataStore
     */
    getData() {
        let data;
        try {
            data = JSON.parse(localStorage.getItem(storage_key));
        } catch {
            return null;
        }


        if (!data) {
            console.log(`Data with the id ${storage_key} was not found in the local storage`);
            return false
        }
        return data
    }

    /**
     *
     * @param {*} data The data wanted to be stored
     */
    setData(data) {
        let valid = true;
        if (typeof this.validator === 'function') {
            valid = this.validator(data)
        }

        if (!valid) {
            console.assert(false, `Data given to Storage Store ${this.name}`, "was incorrect ", data);
            throw new Error(`Data given to Storage Store ${this.name} was incorrect ${data}`);
        }

        localStorage.setItem(this.storage_key, JSON.stringify(data));
    }

    /**
     *
     * @param {*} validator - Sets the validator function for the inserted data
     */
    setValidator(validator) {
        this.validator = validator;
    }

    clearstorage() {
        this.setData(undefined);
    }
}

export const Storage = new DataStore("userdata", [storage_key]);
//Storage.clearstorage();


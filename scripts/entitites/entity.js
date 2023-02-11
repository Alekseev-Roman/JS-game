export let Entity = {
    pos_x: 0,
    pos_y: 0,
    size_x: 0,
    size_y: 0,

    extend: function (extendProto) {
        let object = Object.create(this);
        for(let property in extendProto) {
            if(this.hasOwnProperty(property) || typeof object[property] === 'undefined') {
                object[property] = extendProto[property];
            }
        }
        return object;
    }
};


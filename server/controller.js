const bcrypt = require(`bcryptjs`);
const { pipeline } = require("stream");
let chats = [];

module.exports = {
    createMessage: (req,res) =>
    {
        const {pin, message} = req.body;
        
        for(let i = 0; i < chats.length; i++)
        {
            const existing = bcrypt.compareSync(pin, chats[i].pinHash)

            console.log(pin.pinHash)

            if(existing)
            {
                chats[i].messages.push(message);

                let messagesToReturn = {...chats[i]};
                delete messagesToReturn.pinHash;

                res.status(200).send(messagesToReturn);
                return;
            }
        }

        console.log(req.body)
       

        const salt = bcrypt.genSaltSync(5)
        const pinHash = bcrypt.hashSync(pin, salt);

        console.log(pin, pinHash)

        let msgObj = {
            pinHash,
            messages: [message]
        }

        chats.push(msgObj)
        let messagesToReturn = {...msgObj};
        delete messagesToReturn.pinHash;

        res.status(200).send(messagesToReturn)
    }
}

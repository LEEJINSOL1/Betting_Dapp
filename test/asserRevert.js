module.exports = async(promise) =>{

    try{
        await promise;
        asser.fail('Expected revert not received');
    } catch(error){
        const revertFound = error.message.search('revert') >=0;
        assert(revertFound, 'Expected "rever" ,got ${error} instance ');
    }
}
/**
Template Controllers

@module Templates
*/

/**
The namereg module is for global name registration and management of Ethereum addresses.

@class [template] views_namereg
@constructor
*/

var nameregInstance,
    transactionObject;

Template['views_namereg'].created = function(){
	Meta.setSuffix(TAPi18n.__("dapp.namereg.title"));
    
    nameregInstance = objects.defaultComponents.NameReg;
    transactionObject = {
        from: web3.eth.defaultAccount,
        gas: 3000000
    };
};

Template['views_namereg'].helpers({
    'nameregAddress': function(){
        return nameregInstance.address;
    },
    'selectedAccount': function(){
        return web3.eth.defaultAccount;  
    },
});

Template['views_namereg'].events({
    /**
    Register your name.

    @event (click .btn-register)
    */

    'click .btn-register': function(event, template){
        var value = web3.clean($('#nameregValue').val()),
            account = web3.eth.defaultAccount,
            transactionCallback = function(err, result){
                if(err)
                    return TemplateVar.set(template, 'state', {
                        isError: true, 
                        isRegistering: true, 
                        error: err
                    });
            },
            eventFilter = {account: account},
            eventCallback = function(err, result){
                if(err)
                    return TemplateVar.set(template, 'state', {
                        isError: true, 
                        isRegistering: true, 
                        error: err
                    });
                
                Names.upsert({address: account}, 
                             {address: account, name: value});
                TemplateVar.set(template, 'state', {
                    isRegistering: true, 
                    isSuccess: true
                });
            };
        TemplateVar.set(template, 'state', {
            isMining: true, 
            isRegistering: true
        });
        
        nameregInstance.AddressRegistered(eventFilter, eventCallback);
        nameregInstance.register.sendTransaction(web3.fromAscii(value, 32), transactionObject, transactionCallback);
    },
    
    
    /**
    Unregister your name.

    @event (click .btn-register)
    */

    'click .btn-unregister': function(event, template){
        var account = web3.eth.defaultAccount,
            transactionCallback = function(err, result){
                if(err) 
                    return TemplateVar.set(template, 'state', {
                        isError: true, 
                        isUnregistering: true, 
                        error: err
                    });
            },
            eventFilter = {account: account},
            eventCallback = function(err, result){
                if(err) 
                    return TemplateVar.set(template, 'state', {
                        isError: true, 
                        isUnregistering: true, 
                        error: err
                    });

                Names.upsert({address: account}, 
                             {address: account, name: ''});
                TemplateVar.set(template, 'state', {
                    isUnregistering: true, 
                    isSuccess: true
                });
            };
        TemplateVar.set(template, 'state', {
            isMining: true, 
            isUnregistering: true
        });
        
        nameregInstance.AddressDeregistered(eventFilter, eventCallback);
        nameregInstance.unregister.sendTransaction(transactionObject, transactionCallback);
    },
    
    
    /**
    Lookup a name.

    @event (click .btn-name-lookup)
    */

    'click .btn-lookup': function(event, template){
        var value = web3.clean($('#nameregValue').val()),
            account = web3.eth.defaultAccount,
            nameOfCallback = function(err, result){
                if(err)
                    return;
                
                result = web3.clean(web3.toAscii(result));
                
                Names.upsert({address: value}, 
                             {address: account, name: result});
                TemplateVar.set(template, 'value', result);
            },
            addressOfCallback = function(err, result){
                if(err)
                    return;
                
                Names.upsert({name: value},
                             {address: result, name: value});
                TemplateVar.set(template, 'value', String(result));
            };
        
        if(web3.isAddress(value))
            nameregInstance.nameOf.call(value, nameOfCallback);
        else
            nameregInstance.addressOf.call(web3.fromAscii(value, 32), addressOfCallback);
    },
    
    
    /**
    Set the NameReg Contract Address

    @event (click .btn-set-address)
    */

    'click .btn-set-address': function(event, template){
        var nameregAddress = $('#nameregAddress').val();
        
        if(!web3.isAddress(nameregAddress))
            return TemplateVar.set(template, 'state', {
                isError: true, 
                isSetting: true,
                error: err
            });
            
        LocalStore.set('nameregAddress', nameregAddress);
    },
    
    
    /**
    Deploy a NameReg contract.

    @event (click .btn-deploy)
    */

    'click .btn-deploy': function(event, template){
        TemplateVar.set(template, 'state', {isMining: true, isDeploying: true});
        
        NameReg.new(_.extend(transactionObject, {data: NameReg.bytecode}),
                    function(err, result){
            
            if(err)
                return TemplateVar.set(template, 'state', {
                    isDeploying: true, 
                    isError: true, 
                    error: err
                });
            
            if(!result.address)
                return;
            
            nameregInstance = result;
            LocalStore.set('nameregAddress', result.address);
            TemplateVar.set(template, 'state', {
                isSuccess: true, 
                isDeploying: true, 
                address: result.address
            });
            TemplateVar.set(template, 'value', result.address);
        });
    },
});
#! /usr/bin/env node

var args       = process.argv.slice( 2 ),
    cli        = require('child_process'),
    inq        = require('inquirer'),
    fs         = require('fs-extra'),
    tpl        = require('handlebars'),
    gen        = require('./generator'),
    config     = require('./config')
    module     = require('./module'),
    prototype  = require('./prototype');


/***************************************************

	----- Prototype-css-cli -----

	This script creates component and prototype
	using configured templates, and updates 
	output files to include files in configured
	order


***************************************************/

// set config service provider

config.setFileSystem( fs )
      .setTemplateProvider( tpl )
      .setModuleFactory( module );


//set generator config

gen.setConfig( config );

//set the generator on prototype cli

prototype.setGen( gen )
         .setCli( inq );

//first argument is the command

var command = args[0];


//execute command

prototype.setConfig( config )
         .exec( command, args.slice(1) );

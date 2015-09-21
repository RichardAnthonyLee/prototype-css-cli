
module.exports = {	
	module: function( fs, data, dir, config ){

		this.data   = data;
		this.fs     = fs;
		this.dir    = dir;
		this.config = config;

		this.has = function( file, dir )
		{

			try{

				return !!this.getFile( file, dir );

			} catch( error ) {

				//do nothing, it's only a test to see if the file exists
				return false;

			}	

		}

		this.exists   = function()
		{

			try{

				//check if it has it's own directory
				return this.fs.lstatSync( this.dir ).isDirectory();

			} catch( error ) {

				return false;

			}

		}

		this.getPath  = function( path, dir )
		{

			var base = this.dir;

			//if root dir is given, append it to base path
			if( dir ) base += "/" + this.config[ dir ];

			return this.dir + "/" + this.config[ path ];

		}

		this.getFile  = function( file, dir )
		{

			//assume real path is given
			var path = this.dir + "/" + file;

			//if config variable is beign reference
			//prefer it
			if( this.config[ file ] ) path = this.getPath( file, dir );


			return this.fs.readFileSync( path );

		}

	},
	make: function( fs, data, dir, config ){

		return new this.module( fs, data, dir, config );

	}
};
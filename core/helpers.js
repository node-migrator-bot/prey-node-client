var fs = require('fs'),
		path = require('path'),
		Command = require('../lib/command');

exports.run_cmd = function(cmd, callback){

	cmd = new Command(cmd);
	cmd.on('return', function(output){
		callback(output);
	});

};

exports.check_and_store_pid = function(pid_file){

	if(path.existsSync(pid_file)){

		var pid = parseInt(fs.readFileSync(pid_file));
		if(!isNaN(pid)) {

			log("\n -- Prey seems to be running already! PID: " + pid.toString());

			try {
				process.kill(pid, 'SIGWINCH')
				process.exit(0);
			} catch(e) {
				log(" -- Not really! Pidfile was just lying around.");
			}

		}

	}

	exports.save_file_contents(pid_file, process.pid.toString());

};

exports.clean_up = function(pid_file){
		// if(!self.running)
		fs.unlink(pid_file);
		log(" -- Cleaning up!");
}

exports.get_logged_user = function(){

	exports.run_cmd(os.get_logged_user_cmd, function(user_name){
		GLOBAL.logged_user = user_name.first_line();
	});

}

exports.tempfile_path = function(filename){

	return os.temp_path + '/' + filename;

};

exports.save_file_contents = function(file_name, data){

	fs.writeFile(file_name, data, function (err) {
		if (err) throw err;
		// console.log(' -- File saved: ' + file_name);
	});

};

exports.replace_in_file = function(file_name, from, to){

	fs.readFile(file_name, function (err, data) {
		if (err) throw err;
		var new_data = data.toString().replace(from, to);
		if(new_data != data) exports.save_file_contents(file_name, new_data)
	});

};
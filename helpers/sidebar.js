module.exports = function(viewModel, cb){
	viewModel.sidebar = {
		stats: Stats(),
		popular: Images.popular(),
		comments: Comments.newest()
	};

	cb(viewModel);
};
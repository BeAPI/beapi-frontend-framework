module.exports = [
	{
		name: 'js',
		options: ['js-lint'],
		task: 'js-dist'
	},
	{
		name: 'sass',
		options: false,
		task: 'sass'
	},
	{
		name: 'critical-css',
		options: false,
		task: 'critical-css'
	},
	{
		name: 'iconfont',
		options: false,
		task: 'iconfont'
	},
	{
		name: 'svgicons',
		options: false,
		task: 'svg-icons'
	},
	{
		name: 'favicon',
		options: false,
		task: 'favicon'
	},
	{
		name: 'imagemin',
		options: false,
		task: 'imagemin'
	}
];
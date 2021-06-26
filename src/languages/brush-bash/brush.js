import BrushBase from '../brush-base/brush-base.js';
import { commonRegExp as regexLib, xRegExp } from '../../utilities/syntaxhighlight-regex/syntaxhighlight-regex.js';
import { Match } from '../../utilities/syntaxhighlight-match/lib/match.js';

function Brush() {
	function hereDocProcess(match) {
		const result = [];

		if (match.here_doc !== null) {
			result.push(new Match(match.here_doc, match.index + match[0].indexOf(match.here_doc), 'string'));
		}

		if (match.full_tag !== null) {
			result.push(new Match(match.full_tag, match.index, 'preprocessor'));
		}

		if (match.end_tag !== null) {
			result.push(new Match(match.end_tag, match.index + match[0].lastIndexOf(match.end_tag), 'preprocessor'));
		}

		return result;
	}

	const keywords = 'if fi then elif else for do done until while break continue case esac function return in eq ne ge le';
	const commands = 'alias apropos awk basename base64 bash bc bg builtin bunzip2 bzcat bzip2 bzip2recover cal cat cd cfdisk chgrp chmod chown chroot' +
		'cksum clear cmp comm command cp cron crontab crypt csplit cut date dc dd ddrescue declare df ' +
		'diff diff3 dig dir dircolors dirname dirs du echo egrep eject enable env ethtool eval ' +
		'exec exit expand export expr false fdformat fdisk fg fgrep file find fmt fold format ' +
		'free fsck ftp gawk gcc gdb getconf getopts grep groups gunzip gzcat gzip hash head history hostname id ifconfig ' +
		'import install join kill less let ln local locate logname logout look lpc lpr lprint ' +
		'lprintd lprintq lprm ls lsof make man mkdir mkfifo mkisofs mknod more mount mtools ' +
		'mv nasm nc ndisasm netstat nice nl nohup nslookup objdump od open op passwd paste pathchk ping popd pr printcap ' +
		'printenv printf ps pushd pwd quota quotacheck quotactl ram rcp read readonly renice ' +
		'remsync rm rmdir rsync screen scp sdiff sed select seq set sftp shift shopt shutdown ' +
		'sleep sort source split ssh strace strings su sudo sum symlink sync tail tar tee test time ' +
		'times touch top traceroute trap tr true tsort tty type ulimit umask umount unalias ' +
		'uname unexpand uniq units unset unshar useradd usermod users uuencode uudecode v vdir ' +
		'vi watch wc whereis which who whoami Wget xargs xxd yes chsh zcat';

	this.regexList = [{
		regex: /^#!.*$/gm,
		css: 'preprocessor bold',
	}, {
		regex: /\/[\w-/]+/gm,
		css: 'plain',
	}, {
		regex: regexLib.singleLinePerlComments,
		css: 'comments',
	}, {
		regex: regexLib.doubleQuotedString,
		css: 'string',
	}, {
		regex: regexLib.singleQuotedString,
		css: 'string',
	}, {
		regex: new RegExp(this.getKeywords(keywords), 'gm'),
		css: 'keyword',
	}, {
		regex: new RegExp(this.getKeywords(commands), 'gm'),
		css: 'functions',
	}, {
		// eslint-disable-next-line new-cap
		regex: new xRegExp('(?<full_tag>(&lt;|<){2}(?<tag>\\w+)) .*$(?<here_doc>[\\s\\S]*)(?<end_tag>^\\k<tag>$)', 'gm'),
		func: hereDocProcess,
	}];
}

Brush.prototype = new BrushBase();
export default Brush;

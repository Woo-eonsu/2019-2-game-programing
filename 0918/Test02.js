var i = prompt("원하는 단 입력", 0);

document.writeln("<br><br>" + i +"단 <br><br>");
for (var j = 1; j < 10; j++) {
	document.writeln(i + "x" + j + "=" + i*j + "<br><br>");
}
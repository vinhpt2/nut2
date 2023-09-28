var num2vnword={
	t:["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"],
	r:function(r, n) {
		var o = "",
			a = Math.floor(r / 10),
			e = r % 10;
		return a > 1 ? (o = " " + this.t[a] + " mươi", 1 == e && (o += " mốt")) : 1 == a ? (o = " mười", 1 == e && (o += " một")) : n && e > 0 && (o = " lẻ"), 5 == e && a >= 1 ? o += " lăm" : 4 == e && a >= 1 ? o += " tư" : (e > 1 || 1 == e && 0 == a) && (o += " " + this.t[e]), o
	},
	n:function(n, o) {
		var a = "",
			e = Math.floor(n / 100),
			n = n % 100;
		return o || e > 0 ? (a = " " + this.t[e] + " trăm", a += this.r(n, !0)) : a = this.r(n, !1), a
	},
	o:function(t, r) {
		var o = "",
			a = Math.floor(t / 1e6),
			t = t % 1e6;
		a > 0 && (o = this.n(a, r) + " triệu", r = !0);
		var e = Math.floor(t / 1e3),
			t = t % 1e3;
		return e > 0 && (o += this.n(e, r) + " ngàn", r = !0), t > 0 && (o += this.n(t, r)), o
	},
	convert:function(r) {
		if (0 == r) return this.t[0];
		var n = "",
			a = "";
		do ty = r % 1e9, r = Math.floor(r / 1e9), n = r > 0 ? this.o(ty, !0) + a + n : this.o(ty, !1) + a + n, a = " tỷ"; while (r > 0);
		return n.trim()
	}
}
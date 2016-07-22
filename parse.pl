#!/usr/bin/perl
#
# generate base.js from perpetuum planner data files
#
use strict;
use utf8;
use open qw(:std :utf8);                                                        

use locale;
use Data::Dumper;
use JSON;
sub parseString($){
    local $_= shift;
#    s/\[\|(.+)\]/;
}
my %names;
my %meta;
my $trans={};
my %categories;
sub parseEntities(){
    my %h;
    open(F,"productionComponentsList.txt") or die "cannot open file : $!";
    while(<F>){
	chomp;
	#print Dumper($_);
	my($key,$comps) = /^\#\w+\=\[\|definition=(\w+)\|components=\[(.+)\]\]\s*$/;
	next unless exists $names{$key};
	#$h{$key} = $comps;
	my @data = split /\|c\w+=/,$comps;
	my $name =  $names{$key};
	#next if ($meta{$key}->{tier} =~ /[0\-]/);
	#next if ($meta{$key}->{type} eq 'proto' && $meta{$key}->{tier} ne 'П');
	next if ($meta{$key}->{cat} eq "Изотопы");
	next if ($name =~ /^(Platinum|Emerald|Ruby|Рубин)/);
	next if ($name =~ /компонент/ &&  $meta{$key}->{cat} =~  /компоненты/);
	#next if ($name =~ /\(PL\-\d+\)$/);
	#print Dumper($name,$meta{$key});
	$h{$name} = { %{$meta{$key}}};
	foreach (@data){
	    if(/definition=(\w+)\|amount=i(\w+)/){
		my $matId=$names{$1};
		my $matValue=hex($2);
		if($h{$name}->{type} ne 'proto') {
		    next if $matId =~ /компонент/;
		}
		$h{$name}->{material}->{$matId} = $matValue;
	    }
	}
    }
    close(F);
    return \%h;
}
sub parseDefaults(){
    open(F,"getEntityDefaults.txt") or die "cannot open file : $!";
    while(<F>){
	chomp;
	#print Dumper($_);
	next if /hidden=i1/;
	next if /purchasable=i0/;
	my($key,$comps,$cat) = /^\#\w+\=\[\|definition=(\w+)\|definitionname=\$([\w_]+)\|.*categoryflags=L(\w+).*$/;
	my($module) = /moduleFlag=i(\w+).*$/;

	my $n = $trans->{$comps} || $comps;
	$names{$key} = $n;
	$cat = $categories{$cat} || $cat;
	$meta{$key}->{cat}  = $cat;
	$meta{$key}->{img}  = $comps;
	if ( /tier=\$(\w+)/){
	    my $tier = $trans->{$1} || $1;
	    $meta{$key}->{tier}  = $tier;
	    if ($tier =~ /[ПP]/){
		$meta{$key}->{type} = 'proto';
	    }
	}
	if($cat =~ /атериалы/){
	    $meta{$key}->{type} = 'base';
	}
	if($cat =~ /(патрон|болванк|ракет|кассет)/){
	    $meta{$key}->{num} = 1000;
	}
	if($cat =~ /энергоячейки/){
	    $meta{$key}->{num} = 1250;
	}
    }    
    close(F);
}
sub parseTranslation(){
    my %h;
    open(F,"ru.txt") or die "cannot open file : $!";
    while(<F>){
	chomp;
	if( /^\s+\|([\w_]+)=\$(.+)$/){
	    $h{$1} = $2;
	}
    }
    close(F);
    return \%h;
}
sub parseCategories(){
    open(F,"categoryFlags.txt") or die "cannot open file : $!";
    while(<F>){
	chomp;
	if( /^\s+.*value=L(\w+)\|name=\$([\w_]+)\|/){
	    $categories{$1} = $trans->{$2} || $2;
	}
    }
    close(F);
}

my $json = JSON->new->allow_nonref;
$trans = parseTranslation();
parseCategories();
#exit 0;
parseDefaults();
my $comps = parseEntities();
open(F,">base.js") or die "cannot open $!";
print F "var prodData = {\n";
sub compareObj(){
  return $comps->{$a}->{cat} cmp $comps->{$b}->{cat}  || 
        $comps->{$a}->{type} cmp $comps->{$b}->{type}  || 
        $comps->{$a}->{tier} cmp $comps->{$b}->{tier}  || 
       $a cmp $b ;
}
my $sep="";
foreach ( sort compareObj (keys(%$comps))){
    #print "$comps->{$_}->{cat}\n";
    my $key = $_;
    s/\"/\\\"/g;
    print F  $sep,"\"$_\": ",to_json( $comps->{$key}, { pretty => 0 } );
    $sep= ",\n";
}
print F "};\n";
close(F);

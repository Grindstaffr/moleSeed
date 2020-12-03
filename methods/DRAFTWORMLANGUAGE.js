/*

			$ - sigil for worm ($[WORMNAME])
			_ - sigil for linked thing(or.?) ($tony_#home<address>)
			# - property key marker
			<> - property value marker
			% - function
			|| - function returnvalue?
			$[] - worm cache? $worm_@[]
			&s&   - string
			&n&   - number
			&&

			%GET_#width|VALUE|=>$worm_@[VALUE]




			declarations:
			$worm_#seek<VALUE>
			$worm_#home<VALUE>
			#home=>%dclr_$worm<VALUE>
			$worm_%dclr_#trgt<VAL>


			incantations:




			ALOC (allocate)
			CLON (clone)
			INCH (inch)
			seek (seek target == data (slow way down))
			home (target == address (13.13.17))
			_/\_ (inch)(move to nearest open memory);


			need both!!!:

			*worm-{
				%def_(WORM)<&s&wormname>
				$wormname_#seek<&s&SWARM/phoenix>
				$wormname_%MUTA<&n&4>:
					%MUTA#|a|=>%def_(CHLD)<&s&worm1name>
					%MUTA#|b|=>%def_(CHLD)<&s&worm2name>;
				$worm2name_#home<&a&sdgf768&*%^.A178923g&*.asd72%14lmd0*>
				$worm2name_%CLON<&n&64>=>FIN!
				$worm1name_%CLON<&n&64>=>FIN!
			}

			// need a *ex for each type of named worm!

			*ex_$wormname-{

				//do for all worms!

	
			}

			*ex_$worm2-{

				//do for specific worms!
	
			}



		*/
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pelawat>
 */
class PelawatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    private static $sequence = 1;
    public function definition(): array
    {
        $idNumber = str_pad(self::$sequence++, 3, '0', STR_PAD_LEFT);
        return [
            'fld_vis_id' => 'VIS-' . $idNumber,
            'fld_vis_noIC' => $this->faker->numerify('######-##-####'),
            'fld_vis_namaPenuh' => $this->faker->name(),
            'fld_vis_noTelefon' => '+601' . $this->faker->numerify('########'),
            'fld_vis_noKenderaan' => strtoupper($this->faker->bothify('??? ####')),
            'fld_vis_urlGambarWajah' => null,
            'fld_vis_statusSenaraiHitam' => $this->faker->boolean(15), // 15% chance to be in blacklist
        ];
    }
}
